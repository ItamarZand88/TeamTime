import { Octokit } from "octokit";

// Create Octokit instance with GitHub token from environment variable
// Using TOKEN instead of GITHUB_TOKEN
export const octokit = new Octokit({
  auth: process.env.TOKEN,
});