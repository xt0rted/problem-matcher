import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getInput, setFailed } from "@actions/core";
import { issueCommand } from "@actions/core/lib/command"

import type { ProblemMatcherDocument } from "github-actions-problem-matcher-typings";

export async function run(): Promise<void> {
  try {
    const action = getInput("action");

    const matcherFile = join(__dirname, "problem-matcher.json");

    switch (action) {
      case "add":
        issueCommand(
          "add-matcher",
          {},
          matcherFile,
        );
        break;

      case "remove":
        const fileContents = await readFile(matcherFile, { encoding: "utf8" });
        const problemMatcherDocument: ProblemMatcherDocument = JSON.parse(fileContents);
        const problemMatcher = problemMatcherDocument.problemMatcher[0];

        issueCommand(
          "remove-matcher",
          {
            owner: problemMatcher.owner,
          },
          "",
        );
        break;

      default:
        throw Error(`Unsupported action "${action}"`);
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      throw error;
    }
  }
}

run();
