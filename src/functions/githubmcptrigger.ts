import { z } from "zod";
import { app, InvocationContext } from "@azure/functions";

// Zod schema for input
const GitHubIssuesSchema = z.object({
  count: z.coerce.number().min(1).max(10).describe("Number of latest GitHub issues to retrieve"),
});

// Main handler
export async function githubIssuesTool(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  context.log("Invoking GitHub Issues MCP Tool");

  const args = GitHubIssuesSchema.parse(context.triggerMetadata?.mcptoolargs || {});
  const url = `https://api.github.com/repos/MicrosoftDocs/msteams-docs/issues?state=open&sort=created&direction=desc&per_page=${args.count}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "mcp-github-function",
      },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`GitHub API Error (${response.status}): ${msg}`);
    }

    const issues = await response.json();

    if (!Array.isArray(issues) || issues.length === 0) {
      return "No recent GitHub issues found in the repository.";
    }
    const formatted = issues.map((issue: any, idx: number) => {
      return [
        ` **Issue ${idx + 1}: ${issue.title}**`,
        ` **Body (truncated):** ${issue.body ? issue.body.slice(0, 300) + '...' : 'No description provided.'}`,
        ` **Created by:** ${issue.user?.login ?? 'Unknown'} |  ${new Date(issue.created_at).toLocaleString()}`,
        ` **Labels:** ${issue.labels?.map((l: any) => l.name).join(", ") || "None"}`,
        ` ${issue.html_url}`,
        '–––'
      ].join('\n');
    });

    return `**Top ${args.count} GitHub Issues from MicrosoftDocs/msteams-docs**\n\n${formatted.join("\n\n")}`;
  } catch (err: any) {
    context.error("Error in GitHub tool:", err);
    return `Failed to fetch GitHub issues: ${err.message}`;
  }
}

// MCP tool registration
app.mcpTool("githubIssuesTool", {
  toolName: "github-issues",
  description: "Fetches the latest open GitHub issues from MicrosoftDocs/msteams-docs with detailed summaries.",
  toolProperties: GitHubIssuesSchema,
  handler: githubIssuesTool,
});
