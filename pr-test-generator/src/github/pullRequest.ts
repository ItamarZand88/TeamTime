import { octokit } from "./client.js";
import { ChangedFile, FunctionInfo } from "../types/index.js";

/**
 * Get all changed files from a pull request
 */
export async function getPullRequestChanges(
  owner: string,
  repo: string,
  pullNumber: number
): Promise<ChangedFile[]> {
  try {
    // Get list of files changed in the PR
    const { data: changedFiles } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pullNumber,
    });

    // Filter to only include source code files
    const codeFiles = changedFiles.filter((file) => {
      const ext = file.filename.split(".").pop()?.toLowerCase();
      return [
        "ts",
        "js",
        "jsx",
        "tsx",
        "py",
        "java",
        "cs",
        "go",
        "rb",
        "php",
        "c",
        "cpp",
        "h",
        "hpp",
      ].includes(ext || "");
    });

    // Get content for each file
    const filesWithContent = await Promise.all(
      codeFiles.map(async (file) => {
        // Skip deleted files
        if (file.status === "removed") {
          return {
            ...file,
            content: "",
          };
        }

        try {
          // Get the file content from the PR head
          const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: file.filename,
            ref: `pull/${pullNumber}/head`,
          });

          // Handle file content
          if ("content" in data && typeof data.content === "string") {
            const content = Buffer.from(data.content, "base64").toString();

            // Detect language based on file extension
            const ext = file.filename.split(".").pop()?.toLowerCase();
            let language;

            switch (ext) {
              case "ts":
              case "tsx":
                language = "typescript";
                break;
              case "js":
              case "jsx":
                language = "javascript";
                break;
              case "py":
                language = "python";
                break;
              case "java":
                language = "java";
                break;
              case "cs":
                language = "csharp";
                break;
              case "go":
                language = "go";
                break;
              case "rb":
                language = "ruby";
                break;
              case "php":
                language = "php";
                break;
              case "c":
              case "cpp":
              case "h":
              case "hpp":
                language = "cpp";
                break;
              default:
                language = "unknown";
            }

            return {
              ...file,
              content,
              language,
            };
          }

          return {
            ...file,
            content: "",
          };
        } catch (error) {
          console.error(`Error getting content for ${file.filename}:`, error);
          return {
            ...file,
            content: "",
          };
        }
      })
    );

    return filesWithContent;
  } catch (error) {
    console.error("Error fetching PR changes:", error);
    throw new Error("Failed to fetch PR changes");
  }
}

/**
 * Extract new or modified functions from changed files
 */
export function extractNewFunctions(
  changedFiles: ChangedFile[]
): Map<string, FunctionInfo[]> {
  const functionsMap = new Map<string, FunctionInfo[]>();

  for (const file of changedFiles) {
    // Skip files without content or deleted files
    if (!file.content || file.status === "removed") continue;

    // Extract functions based on language
    const functions = extractFunctionsFromCode(
      file.content,
      file.language || "unknown"
    );

    if (functions.length > 0) {
      functionsMap.set(file.filename, functions);
    }
  }

  return functionsMap;
}

/**
 * Extract functions from code based on language
 */
function extractFunctionsFromCode(
  code: string,
  language: string
): FunctionInfo[] {
  const functions: FunctionInfo[] = [];
  const lines = code.split("\n");

  switch (language) {
    case "typescript":
    case "javascript":
      // Regex for function declarations
      const jsRegexes = [
        /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]*))?/g,
        /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)(?:\s*:\s*([^=]*))?(?:\s*=>)/g,
        /(?:export\s+)?(?:public|private|protected)?\s*(?:async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]*))?/g,
      ];

      let fnStartLine = -1;
      let openBraces = 0;
      let currentFunction: Partial<FunctionInfo> | null = null;
      let inFunction = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if this line contains a function declaration
        if (!inFunction) {
          for (const regex of jsRegexes) {
            regex.lastIndex = 0;
            const match = regex.exec(line);
            if (match) {
              const [_, name, params, returnType] = match;
              currentFunction = {
                name,
                parameters: params
                  .split(",")
                  .map((p) => p.trim())
                  .filter(Boolean),
                returnType: returnType?.trim(),
                startsAtLine: i + 1,
              };
              fnStartLine = i;
              inFunction = true;
              openBraces = line.split("{").length - line.split("}").length;
              break;
            }
          }
        } else {
          // Count braces to find function end
          openBraces += line.split("{").length - line.split("}").length;

          if (openBraces === 0) {
            // Function ended
            const functionCode = lines.slice(fnStartLine, i + 1).join("\n");
            functions.push({
              ...currentFunction!,
              code: functionCode,
              endsAtLine: i + 1,
            } as FunctionInfo);

            inFunction = false;
            currentFunction = null;
          }
        }
      }
      break;

    // Add cases for other languages here
    case "python":
      // Simple Python function extraction
      let pyFnStartLine = -1;
      let inPyFunction = false;
      let indentation = 0;
      let pyFunctionName = "";
      let pyFunctionParams: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check for function definition
        const defMatch = line.match(
          /^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\):/
        );
        if (defMatch && !inPyFunction) {
          inPyFunction = true;
          pyFnStartLine = i;
          pyFunctionName = defMatch[1];
          pyFunctionParams = defMatch[2]
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          indentation = line.search(/\S/);
        } else if (inPyFunction) {
          // If we're in a function, check indentation to see if we've exited
          if (line.trim() !== "" && line.search(/\S/) <= indentation) {
            // Function has ended
            const functionCode = lines.slice(pyFnStartLine, i).join("\n");
            functions.push({
              name: pyFunctionName,
              code: functionCode,
              parameters: pyFunctionParams,
              startsAtLine: pyFnStartLine + 1,
              endsAtLine: i,
            });

            inPyFunction = false;
            // Check if this line is also a function definition
            i--; // Reprocess this line
          } else if (i === lines.length - 1) {
            // End of file and still in function
            const functionCode = lines.slice(pyFnStartLine).join("\n");
            functions.push({
              name: pyFunctionName,
              code: functionCode,
              parameters: pyFunctionParams,
              startsAtLine: pyFnStartLine + 1,
              endsAtLine: i + 1,
            });
          }
        }
      }
      break;

    default:
      // For unsupported languages, return empty array
      break;
  }

  return functions;
}