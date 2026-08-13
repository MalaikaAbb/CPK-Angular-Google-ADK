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
import { CopilotRuntime } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { HttpAgent } from "@ag-ui/client";

// backend/main.py mounts the ADK AG-UI endpoint on POST / and binds port 8000.
const agentUrl =
  process.env["GOOGLE_ADK_AGENT_URL"] ?? "http://localhost:8000/";

const runtime = new CopilotRuntime({
  agents: {
    default: new HttpAgent({ url: agentUrl }),
    support: new HttpAgent({ url: agentUrl }),
  },
  a2ui: {},
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
