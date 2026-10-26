/**
 * Copilot Runtime for this harness.
 *
 * Shape comes from the Angular quickstart's Node runtime server
 * (https://docs.copilotkit.ai/angular/google-adk/quickstart), with the agent
 * bound to the Google ADK backend in `../backend` — the Angular/Google ADK
 * quickstart defers the backend step to "register this backend as the
 * `default` agent".
 *
 * That backend exposes a plain AG-UI endpoint — `add_adk_fastapi_endpoint(app,
 * adk_agent, path="/")` in backend/main.py mounts a single `POST /` that
 * streams AG-UI events over SSE. The quickstart's runtime snippet binds it with
 * the generic `HttpAgent` from `@ag-ui/client`, so that is the binding here
 * too; there is no ADK-specific server-side wrapper to import.
 *
 * `default` and `support` resolve to the same ADK process. `support` exists so
 * the doc snippets that use `agentId="support"` (Chat UI, Threads) run verbatim.
 *
 * `a2ui: {}` enables A2UIMiddleware for every registered agent, per
 * https://docs.copilotkit.ai/angular/google-adk/backend/copilot-runtime
 */
import { createServer } from "node:http";
import { CopilotKitIntelligence, CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { HttpAgent } from "@ag-ui/client";

// backend/main.py mounts the ADK AG-UI endpoint on POST / and binds port 8000.
const agentUrl =
  process.env["GOOGLE_ADK_AGENT_URL"] ?? "http://localhost:8000/";

// Create the Intelligence client with your project API key. Keep this key on the server.
const intelligence = new CopilotKitIntelligence({
  apiKey: process.env["CPK_INTELLIGENCE_API_KEY"]!,
});

async function authenticateApplicationUser(
  _request: Request,
): Promise<{ id: string; name: string } | null> {
  return { id: "local-user", name: "Local user" };
}

const runtime = new CopilotRuntime({
  agents: {
    default: new HttpAgent({ url: agentUrl }),
    support: new HttpAgent({ url: agentUrl }),
    // The sub-agents supervisor, mounted by backend/main.py at /subagents.
    // `subagents` is the agent id the Angular Showcase uses for this demo.
    // https://docs.copilotkit.ai/angular/google-adk/multi-agent/subagents
    subagents: new HttpAgent({ url: new URL("subagents", agentUrl).href }),
  },
  a2ui: {},
  intelligence,
  // Identify the user from a verified session or token
  identifyUser: async (request) => {
    const user = await authenticateApplicationUser(request);
    if (!user) throw new Error("Unauthorized");
    return { id: user.id, name: user.name };
  },
});

const port = Number(process.env["PORT"] ?? 8200);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: "/api/copilotkit",
    cors: true,
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
  console.log(`Google ADK agent: ${agentUrl}`);
});
