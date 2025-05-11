/**
 * Represents a file changed in a pull request
 */
export interface ChangedFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  content: string;
  language?: string;
}

/**
 * Information about a function extracted from code
 */
export interface FunctionInfo {
  name: string;
  code: string;
  parameters: string[];
  returnType?: string;
  startsAtLine: number;
  endsAtLine: number;
}

/**
 * Details of a generated unit test
 */
export interface GeneratedTest {
  functionName: string;
  testCode: string;
  filename: string;
}

/**
 * Map of filenames to generated tests
 */
export interface TestsGenerationResult {
  [filename: string]: {
    tests: GeneratedTest[];
    targetPath: string;
  };
}