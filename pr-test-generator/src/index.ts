#!/usr/bin/env node
import dotenv from "dotenv";
import fs from "fs";
import { getPullRequestChanges } from "./github/pullRequest.js";
import { generateTests } from "./ai/testGenerator.js";
import { postTestsAsPRComment } from "./github/prComment.js";

// Load environment variables
dotenv.config();

async function main() {
  try {
    let prNumber: number | undefined;
    let repoOwner: string | undefined = process.env.DEFAULT_REPO_OWNER;
    let repoName: string | undefined = process.env.DEFAULT_REPO_NAME;

    // Check if running in GitHub Actions environment
    const gitHubEventPath = process.env.GITHUB_EVENT_PATH;

    if (gitHubEventPath && fs.existsSync(gitHubEventPath)) {
      // We're in GitHub Actions, read event data from file
      console.log("Running in GitHub Actions environment");
      try {
        const eventData = JSON.parse(fs.readFileSync(gitHubEventPath, "utf8"));

        // Get PR number from event data
        if (eventData.pull_request?.number) {
          prNumber = eventData.pull_request.number;
          console.log(`Found PR #${prNumber} from GitHub event data`);

          // Get repository information from event data
          if (eventData.repository) {
            const fullName = eventData.repository.full_name;
            if (fullName) {
              const [owner, repo] = fullName.split("/");
              repoOwner = owner;
              repoName = repo;
              console.log(
                `Found repository: ${repoOwner}/${repoName} from GitHub event data`
              );
            }
          }
        } else if (
          eventData.inputs?.pr_number &&
          process.env.GITHUB_REPOSITORY
        ) {
          // Support for workflow_dispatch with pr_number input
          prNumber = parseInt(eventData.inputs.pr_number, 10);
          const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
          repoOwner = owner;
          repoName = repo;
          console.log(
            `Running from workflow_dispatch for PR #${prNumber} in ${repoOwner}/${repoName}`
          );
        } else {
          console.log(
            "No pull request found in GitHub event data, falling back to CLI arguments"
          );
        }
      } catch (error) {
        console.error("Error parsing GitHub event data:", error);
        console.log("Falling back to CLI arguments");
      }
    }

    // Fall back to CLI arguments if needed
    if (prNumber === undefined) {
      // Get CLI arguments
      const args = process.argv.slice(2);
      prNumber = parseInt(args[0], 10);
      repoOwner = args[1] || repoOwner;
      repoName = args[2] || repoName;
    }

    if (!prNumber || isNaN(prNumber)) {
      console.error("Error: PR number is required");
      console.log("Usage: npm start <pr-number> [repo-owner] [repo-name]");
      process.exit(1);
    }

    if (!repoOwner || !repoName) {
      console.error("Error: Repository owner and name are required");
      console.log("Usage: npm start <pr-number> <repo-owner> <repo-name>");
      process.exit(1);
    }

    console.log(
      `Generating tests for PR #${prNumber} in ${repoOwner}/${repoName}`
    );

    // Get pull request changes
    const changedFiles = await getPullRequestChanges(
      repoOwner,
      repoName,
      prNumber
    );

    if (changedFiles.length === 0) {
      console.log("No changed files found");
      return;
    }

    console.log(`Found ${changedFiles.length} changed files`);

    // Generate tests for changed files
    const generatedTests = await generateTests(changedFiles);

    if (Object.keys(generatedTests).length === 0) {
      console.log("No tests generated");
      return;
    }

    // Post tests as PR comment
    await postTestsAsPRComment(repoOwner, repoName, prNumber, generatedTests);

    console.log("Tests generated and posted successfully");
  } catch (error) {
    console.error("Error running PR test generator:", error);
    process.exit(1);
  }
}

main();