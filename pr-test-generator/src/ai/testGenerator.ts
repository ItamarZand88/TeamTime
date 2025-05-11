import { openai } from "./client.js";
import {
  ChangedFile,
  FunctionInfo,
  GeneratedTest,
  TestsGenerationResult,
} from "../types/index.js";
import { extractNewFunctions } from "../github/pullRequest.js";
import path from "path";

/**
 * Generate unit tests for changed files
 */
export async function generateTests(
  changedFiles: ChangedFile[]
): Promise<TestsGenerationResult> {
  try {
    const result: TestsGenerationResult = {};

    // Extract functions from changed files
    const functionsMap = extractNewFunctions(changedFiles);

    // No functions found
    if (functionsMap.size === 0) {
      console.log("No new or modified functions found in the PR");
      return {};
    }

    // Generate tests for each file with extracted functions
    for (const [filename, functions] of functionsMap.entries()) {
      if (functions.length === 0) continue;

      const fileExt = path.extname(filename);
      const fileDir = path.dirname(filename);
      const baseName = path.basename(filename, fileExt);

      // Determine test file path (follows common conventions)
      let testPath: string;
      if (filename.includes("/src/")) {
        // Convert /src/ paths to /tests/ paths
        testPath = filename
          .replace("/src/", "/tests/")
          .replace(fileExt, `.test${fileExt}`);
      } else {
        // Default to adding .test before the extension
        testPath = path.join(fileDir, `${baseName}.test${fileExt}`);
      }

      const generatedTests: GeneratedTest[] = [];

      // Generate tests for each function
      for (const func of functions) {
        try {
          const testCode = await generateTestForFunction(func, filename);

          if (testCode) {
            generatedTests.push({
              filename: testPath,
              testCode,
              functionName: func.name,
            });
          }
        } catch (error) {
          console.error(
            `Error generating test for ${func.name} in ${filename}:`,
            error
          );
        }
      }

      if (generatedTests.length > 0) {
        result[filename] = {
          tests: generatedTests,
          targetPath: testPath,
        };
      }
    }

    return result;
  } catch (error) {
    console.error("Error generating tests:", error);
    return {};
  }
}

/**
 * Generate unit test for a single function using OpenAI
 */
async function generateTestForFunction(
  func: FunctionInfo,
  filename: string
): Promise<string> {
  // Get file extension to determine language
  const fileExt = path.extname(filename);
  const language = getLanguageFromExt(fileExt);

  // Create prompt based on language
  const prompt = createPromptForFunction(func, language);

  try {
    // Call OpenAI to generate test
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert software developer specializing in writing high-quality unit tests. 
          Your task is to create comprehensive unit tests for the provided function.
          Focus on testing all possible execution paths, edge cases, and happy paths.
          Write tests that are readable, maintainable, and follow best practices for ${language}.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    // Get the generated test code
    const testCode = response.choices[0]?.message.content?.trim();

    if (!testCode) {
      throw new Error("No test code generated from OpenAI");
    }

    // Clean up the code - strip markdown code blocks if present
    return cleanupGeneratedCode(testCode);
  } catch (error) {
    console.error(`OpenAI API error for function ${func.name}:`, error);
    throw new Error(`Failed to generate test for ${func.name}`);
  }
}

/**
 * Create a prompt for the AI to generate a test for the function
 */
function createPromptForFunction(func: FunctionInfo, language: string): string {
  // Different prompts based on language
  switch (language) {
    case "typescript":
    case "javascript":
      return `
Please write unit tests for the following ${language} function:

\`\`\`${language}
${func.code}
\`\`\`

Generate a complete test file using Jest with the following requirements:
1. Import all necessary dependencies and the function being tested
2. Include tests for normal cases, edge cases, and error handling
3. Use mocks or spies where appropriate
4. Add descriptive test names that explain what each test is checking
5. Return ONLY the complete test code without any explanation

The test code should follow standard ${language} testing conventions and be ready to run with Jest.
`;

    case "python":
      return `
Please write unit tests for the following Python function:

\`\`\`python
${func.code}
\`\`\`

Generate a complete test file using pytest with the following requirements:
1. Import all necessary dependencies and the function being tested
2. Include tests for normal cases, edge cases, and error handling
3. Use mocks or fixtures where appropriate
4. Add descriptive test names that explain what each test is checking
5. Return ONLY the complete test code without any explanation

The test code should follow PEP 8 and standard Python testing conventions.
`;

    // Add cases for other languages
    default:
      return `
Please write unit tests for the following function:

\`\`\`
${func.code}
\`\`\`

Generate a complete test file with the following requirements:
1. Import all necessary dependencies and the function being tested
2. Include tests for normal cases, edge cases, and error handling
3. Use mocks or appropriate testing utilities where needed
4. Add descriptive test names that explain what each test is checking
5. Return ONLY the complete test code without any explanation
`;
  }
}

/**
 * Get language from file extension
 */
function getLanguageFromExt(fileExt: string): string {
  switch (fileExt.toLowerCase()) {
    case ".ts":
    case ".tsx":
      return "typescript";
    case ".js":
    case ".jsx":
      return "javascript";
    case ".py":
      return "python";
    case ".java":
      return "java";
    case ".cs":
      return "csharp";
    case ".go":
      return "go";
    case ".rb":
      return "ruby";
    case ".php":
      return "php";
    default:
      return "unknown";
  }
}

/**
 * Clean up generated code, removing markdown formatting if present
 */
function cleanupGeneratedCode(code: string): string {
  // Check if code is wrapped in markdown code blocks
  const codeBlockMatch = code.match(/```(?:\w+)?\s*([\s\S]+?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  return code;
}