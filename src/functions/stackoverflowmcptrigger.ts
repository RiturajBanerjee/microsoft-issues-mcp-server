import { z } from "zod";
import { app, InvocationContext } from "@azure/functions";

// Zod schema for input
const StackOverflowSchema = z.object({
  count: z.coerce.number().min(1).max(10).describe("Number of latest Stack Overflow questions to retrieve"),
});

// Main handler
export async function stackOverflowQuestionsTool(
  _toolArguments: unknown,
  context: InvocationContext
): Promise<string> {
  context.log("Invoking Stack Overflow MCP Tool");

  const args = StackOverflowSchema.parse(context.triggerMetadata?.mcptoolargs || {});
  const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=creation&tagged=microsoft-teams&site=stackoverflow&pagesize=${args.count}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "mcp-stackoverflow-function"
      }
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Stack Overflow API Error (${response.status}): ${msg}`);
    }

    const data = await response.json();
    const questions = data.items;

    if (!Array.isArray(questions) || questions.length === 0) {
      return "No recent Stack Overflow questions found for the 'microsoft-teams' tag.";
    }

    const formatted = questions.map((q: any, idx: number) => {
      return [
        `**Question ${idx + 1}: ${q.title}**`,
        `**Asked by:** ${q.owner?.display_name ?? 'Unknown'} | ${new Date(q.creation_date * 1000).toLocaleString()}`,
        `**Answers:** ${q.answer_count} |  Score: ${q.score}`,
        `${q.link}`,
        '–––'
      ].join('\n');
    });

    return `**Top ${args.count} Stack Overflow Questions Tagged 'microsoft-teams'**\n\n${formatted.join("\n\n")}`;
  } catch (err: any) {
    context.error("Error in Stack Overflow tool:", err);
    return `Failed to fetch Stack Overflow questions: ${err.message}`;
  }
}

// MCP tool registration
app.mcpTool("stackoverflowQuestionsTool", {
  toolName: "stackoverflow-questions",
  description: "Fetches the latest Stack Overflow questions tagged 'microsoft-teams'.",
  toolProperties: StackOverflowSchema,
  handler: stackOverflowQuestionsTool,
});
