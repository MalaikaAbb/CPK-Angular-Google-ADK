# CopilotKit + Google ADK — Angular

A navigable test harness for the Angular section of the CopilotKit Google ADK
documentation. Each guide is a route that actually runs the thing it describes.

Tracks **<https://docs.copilotkit.ai/angular/google-adk>**

---

## Architecture

Three processes, not two. Unlike the React/Next quickstart — where the runtime
lives inside the Next app as an API route — Angular has no server route to host
it, so the Copilot Runtime is its own Node process.

```
Browser (Angular 22, zoneless)                ← :4200
  │  @copilotkit/angular — provideCopilotKit, <copilot-chat>, signal APIs
  │  POST http://localhost:8200/api/copilotkit
  ▼
Copilot Runtime  ·  localhost:8200            ← Node, frontend/server.ts
  │  agents: { default, support } → new HttpAgent({ url })
  │  a2ui: {}  → A2UIMiddleware
  │  POST http://localhost:8000/              ← AG-UI over SSE
  ▼
Google ADK agent  ·  localhost:8000           ← Python / FastAPI, backend/main.py
  │  add_adk_fastapi_endpoint(app, ADKAgent(adk_agent=agent), path="/")
  ▼
Gemini  (gemini-2.5-flash)
```

The model key never reaches the browser, and never reaches the runtime either.
Only the Python process holds it.

**Why two agent ids.** `default` and `support` both resolve to the same ADK
process. `default` is the id CopilotKit's prebuilt components use with no
configuration; `support` exists so the Chat UI and Threads guides' snippets —
written as `agentId="support"` — run exactly as published.

**The binding is `HttpAgent`.** `ag_ui_adk` serves the AG-UI protocol directly
over SSE, so the generic `HttpAgent` from `@ag-ui/client` is what the ADK
quickstart uses. There is no ADK-specific server-side wrapper to import.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 22+ (built on 24.16.0) | The Angular quickstart specifies Node 22. |
| npm | 10+ (built on 12.0.1) | Or pnpm/yarn. |
| Angular CLI | 20, 21, or 22 (built on 22.1.3) | `@copilotkit/angular` supports these three majors only. |
| Python | 3.13+ (per `backend/.python-version`) | Built on 3.13.13. |
| [`uv`](https://docs.astral.sh/uv/) | 0.11+ (built on 0.11.20) | Used for the backend. `pip` works too. |
| Google AI Studio API key | — | **Required.** [Get one here](https://aistudio.google.com/apikey). |
| CopilotKit license key | — | **Optional.** Only affects the Threads and Memory routes. |

`@angular/cdk` must share your Angular major version. If you hit a
peer-dependency error, pin it explicitly (`@angular/cdk@^22` on Angular 22).

---

## Setup

**1. Install frontend deps**

```bash
cd frontend && npm install && cd ..
```

**2. Install backend deps**

```bash
cd backend && uv sync && cd ..
```

**3. Provide the model key**

`backend/main.py` does not call `load_dotenv()`, and `uv run` does not read
`.env` on its own — so a `.env` file alone will **not** be picked up. Export the
key in the shell you start the agent from:

```bash
export GOOGLE_API_KEY=your-key-here
```

Or keep it in a file and point `uv` at it explicitly:

```bash
cd backend && uv run --env-file .env main.py
```

| Variable | Where | What it does |
|---|---|---|
| `GOOGLE_API_KEY` | agent shell | **Required.** The Gemini key. `GEMINI_API_KEY` also works. |
| `GOOGLE_GENAI_USE_VERTEXAI` | agent shell | Set `TRUE` to use Vertex AI instead of AI Studio; then `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION` are required instead of the key. |
| `GOOGLE_ADK_AGENT_URL` | runtime shell | Where the runtime finds the agent. Defaults to `http://localhost:8000/`. |
| `PORT` | runtime shell | Runtime port. Defaults to `8200`. |
| `COPILOTKIT_TELEMETRY_DISABLED` | runtime shell | Opt out of anonymous runtime telemetry. |

> The Angular app's `runtimeUrl` is hardcoded to
> `http://localhost:8200/api/copilotkit` in `frontend/src/app/app.config.ts`,
> following the quickstart. If you change `PORT`, change that too.

**Default ports:** frontend **4200**, runtime **8200**, agent **8000**.

---

## Running the project

Two terminals. The two Node processes share one; the Python agent gets its own.

**Terminal 1 — the agent:**

```bash
cd backend
uv run main.py
```

Success looks like:

```
INFO:     Started server process [37381]
INFO:     Application startup complete.
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)
```

**Terminal 2 — the runtime and the app together:**

```bash
cd frontend
npm run dev
```

`dev` runs the Copilot Runtime and `ng serve` side by side under `concurrently`,
each line prefixed by which process wrote it. Success looks like:

```
[runtime] Copilot Runtime listening at http://localhost:8200/api/copilotkit
[runtime] Google ADK agent: http://localhost:8000/
[angular]   ➜  Local:   http://localhost:4200/
```

Ctrl-C stops both. `--kill-others` means a crash in either takes the other down
rather than leaving half a stack running.

To run them separately — different terminals, independent restarts — the
underlying scripts are still there:

```bash
npm run runtime   # Copilot Runtime only, :8200
npm start         # Angular dev server only, :4200
```

Open **<http://localhost:4200>**. The Introduction route probes both backends
and shows a connection panel — check it first if anything misbehaves.

---

## Verifying the stack

The check the quickstart prescribes — should list `default` and `support`:

```bash
curl -s http://localhost:8200/api/copilotkit/info
```

The agent's own routes, mounted by `add_adk_fastapi_endpoint`:

| Route | Method | Purpose |
|---|---|---|
| `/` | POST | The AG-UI endpoint. A `GET` here answers **405** — that is expected, not a fault. |
| `/capabilities` | GET | Returns `{}` with a 200. This is what the connection panel probes. |
| `/agents/state` | POST | Agent state access. |

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/capabilities   # 200
```

---

## Other commands

```bash
npm run build        # production build into dist/
npm test             # Vitest
npm run gen:sources  # regenerate the on-page source snippets
```

`scripts/generate-sources.ts` reads the real implementation files off disk into
`src/app/lib/generated-sources.ts`, so the code shown on a route is byte-identical
to the code that runs. Angular's esbuild pipeline has no `?raw` import, which is
why it is a prestart/prebuild step rather than an import. It runs automatically
before `npm start` and `npm run build`.

---

## Troubleshooting

**`EADDRINUSE` on 8000, 8200, or 4200.** Something else already holds the port.
Find it with `ss -ltnp | grep :8000`. The agent's port is hardcoded in
`backend/main.py`; the runtime's is overridable with `PORT`.

**Nothing streams in the chat.** Check the connection panel on the Introduction
route. A red dot means that process is down. If both are green, check the
runtime's `/info` lists `default`.

**The agent shows "unreachable" but the chat works, and the agent logs a 200.**
That is CORS, not connectivity. The connection panel reads
`GET /capabilities` straight from the browser, so the agent has to return an
`Access-Control-Allow-Origin` header or the browser discards the response and
`fetch` rejects — which the panel can only report as unreachable. `backend/main.py`
adds `CORSMiddleware` for `http://localhost:4200` to cover this. Serving the app
from a different origin means adding that origin there too. The chat path is
unaffected either way: the browser talks to the runtime, and the runtime calls
the agent server-side where CORS does not apply.

```bash
curl -s -D - -o /dev/null -H 'Origin: http://localhost:4200' \
  http://localhost:8000/capabilities | grep -i access-control
```

**The agent starts but every message errors.** The key is almost certainly not
in the agent's environment — see step 3 above. A `.env` file is not read
automatically by `uv run main.py`.

**Peer-dependency errors on install.** `@angular/cdk` must match your Angular
major version.

---

## Project structure

```
google-adk/
├── backend/
│   ├── main.py            # LlmAgent + ADKAgent + add_adk_fastapi_endpoint, :8000
│   └── pyproject.toml     # google-adk, ag-ui-adk, fastapi, uvicorn
└── frontend/
    ├── server.ts          # Copilot Runtime — the one file binding CopilotKit to ADK
    ├── scripts/           # generate-sources.ts
    └── src/app/
        ├── app.config.ts  # provideCopilotKit — runtimeUrl, a2ui, openGenerativeUI
        ├── features/      # the CopilotKit code each guide teaches
        ├── pages/         # one route per doc page: notes, criteria, source
        ├── components/    # harness chrome (nav, health check, source viewer)
        └── lib/nav-config.ts   # routes, doc links, and status in one place
```

---

## References

- [CopilotKit — Angular + Google ADK](https://docs.copilotkit.ai/angular/google-adk)
- [CopilotKit — Angular/ADK quickstart](https://docs.copilotkit.ai/angular/google-adk/quickstart)
- [Google ADK docs](https://adk.dev)
- [AG-UI protocol](https://ag-ui.com)
