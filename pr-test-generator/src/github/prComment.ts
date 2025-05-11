import { octokit } from "./client.js";
import { TestsGenerationResult } from "../types/index.js";

/**
 * Post generated tests as a comment on the PR
 */
export async function postTestsAsPRComment(
  owner: string,
  repo: string,
  pullNumber: number,
  generatedTests: TestsGenerationResult
): Promise<void> {
  try {
    // Format the comment
    const comment = formatTestsComment(generatedTests);

    // Post the comment
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: comment,
    });
  } catch (error) {
    console.error("Error posting comment to PR:", error);
    throw new Error("Failed to post tests comment");
  }
}

/**
 * Format the tests into a GitHub comment
 */
function formatTestsComment(generatedTests: TestsGenerationResult): string {
  let comment = "## 🧪 Generated Unit Tests\n\n";

  for (const [filename, { tests }] of Object.entries(generatedTests)) {
    if (tests.length === 0) continue;

    comment += `### Tests for \`${filename}\`\n\n`;

    for (const test of tests) {
      comment += `<details>
<summary>Tests for function <code>${test.functionName}</code></summary>

\`\`\`${getLanguageFromFilename(filename)}
${test.testCode}
\`\`\`
</details>

`;
    }
  }

  comment += `\n> These tests were automatically generated. Please review and modify as needed.`;

  return comment;
}

/**
 * Get language identifier from filename for code blocks
 */
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cs":
      return "csharp";
    case "go":
      return "go";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    case "c":
    case "cpp":
    case "h":
    case "hpp":
      return "cpp";
    default:
      return "";
  }
}