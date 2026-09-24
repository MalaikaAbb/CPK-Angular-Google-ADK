import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-quickstart-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode],
  template: `
    <app-route-header path="/quickstart" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo and send <em>Can you tell me a joke?</em>
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> tokens stream in one at a time and render as
          markdown.
          <strong>Fail:</strong> nothing streams — check the connection panel on
          the Introduction route; one of the two backends is down.
        </p>
      </ui-try-it>

      <ui-panel heading="1 · The Google ADK agent">
        <p class="mb-3 text-sm text-slate-700">
          <code>AGUIToolset()</code> in the <code>tools=</code> list is what
          exposes CopilotKit's frontend tools and generative UI components to
          the agent. <code>stop_on_terminal_text</code> is the Gemini
          termination safeguard: it ends the invocation on final text with a
          <code>STOP</code> finish reason, and leaves partial responses and
          pending tool calls alone.
        </p>
        <p class="mb-3 text-sm text-slate-700">
          Earlier revisions of the quickstart imported that callback from
          <code>agents.shared_chat</code>, a showcase-only module that is not on
          PyPI, so it could not be wired up here. The page now defines it in
          full, so this backend runs it.
        </p>
        <ui-source
          path="backend/main.py"
          note="model and getWeather are ours; the callback is the page's"
        />
      </ui-panel>

      <ui-panel heading="2 · The runtime, bound to the Google ADK agent">
        <p class="mb-3 text-sm text-slate-700">
          The Angular quickstart's backend step defers to the selected
          integration: "Configure Copilot Runtime to register this backend as
          the <code>default</code> agent at <code>/api/copilotkit</code>." So
          the Node server below is the quickstart's, with
          <code>BuiltInAgent</code> replaced by the
          <code>HttpAgent</code> binding the Google ADK quickstart uses to reach
          an <code>add_adk_fastapi_endpoint</code> backend.
        </p>
        <ui-source path="server.ts" />
      </ui-panel>

      <ui-panel heading="3 · Import the styles">
        <p class="mb-3 text-sm text-slate-700">
          The package stylesheet is self-contained — the chat renders without
          any other CSS. It is the first import in the global stylesheet, ahead
          of this harness's own chrome.
        </p>
        <ui-source path="src/styles.css" note="first ~10 lines are the doc step" />
      </ui-panel>

      <ui-panel heading="4 · Connect to Copilot Runtime">
        <p class="mb-3 text-sm text-slate-700">
          One provider at the application root. The extra
          <code>a2ui</code> and <code>openGenerativeUI</code> options belong to
          later guides; the quickstart needs only <code>runtimeUrl</code>.
        </p>
        <ui-source path="src/app/app.config.ts" />
      </ui-panel>

      <ui-panel heading="5 · Add the chat UI">
        <ui-source path="src/app/features/quickstart/quickstart-chat.ts" />
      </ui-panel>

      <ui-panel heading="6 · Open Inspector and confirm setup">
        <p class="mb-3 text-sm text-slate-700">
          The quickstart's closing step, and the only one that needs no code:
          <code>enableInspector</code> defaults to on for development browser
          builds and is always off in production and during server rendering,
          so <code>ng serve</code> mounts the Inspector button in the corner on
          its own. This app sets no <code>enableInspector</code> in
          <code>app.config.ts</code>, so the default is what runs.
        </p>
        <ol class="ml-5 list-decimal space-y-1 text-sm text-slate-700">
          <li>
            Open <strong>Agents</strong>, then <strong>Agent</strong>. The
            <code>default</code> agent is listed.
          </li>
          <li>
            Send a chat message. Open <strong>Agents</strong>, then
            <strong>AG-UI Events</strong>. Events are moving.
          </li>
          <li>
            Open <strong>Rich Threads</strong>. Unlicensed — the case here — it
            is locked with <em>Enable Intelligence</em>, which is the expected
            result and matches what the Threads route reports.
          </li>
        </ol>
      </ui-panel>

      <ui-callout title="Verify the runtime before blaming the frontend">
        The quickstart's troubleshooting box prescribes one check:
        <code>http://localhost:8200/api/copilotkit/info</code> should report the
        registered agents. The Introduction route probes exactly that.
      </ui-callout>

  
    </div>
  `,
})
export default class QuickstartPage {
  protected readonly builtInAgentSample = `const runtime = new CopilotRuntime({
  agents: {
    default: new BuiltInAgent({
      model: "openai:gpt-5-mini",
      prompt: "You are a helpful assistant for an Angular app.",
    }),
  },
});`;
}
