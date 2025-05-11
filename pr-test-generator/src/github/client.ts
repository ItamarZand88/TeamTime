import { Octokit } from "octokit";

// Create Octokit instance with GitHub token from environment variable
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});