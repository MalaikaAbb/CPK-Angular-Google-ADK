import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-subagents-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode],
  template: `
    <app-route-header path="/subagents" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          Open the demo and send
          <em>Write a short paragraph on solar panels.</em>
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> a Researcher, Writer, and Critic card appears
          in the transcript as each sub-agent runs, and the delegation log on
          the left grows to 3 calls, each carrying that sub-agent's output.
          <strong>Fail:</strong> the cards render but the log stays empty — the
          tools are not writing the <code>delegations</code> slot of
          <code>tool_context.state</code>. A result starting with
          <code>[sub-agent error]</code> means the secondary Gemini call failed;
          the backend log has the details.
        </p>
      </ui-try-it>

      <ui-panel heading="Supervisor and sub-agents as tools">
        <p class="mb-3 text-sm text-slate-700">
          The guide's module. Each sub-agent is a single-shot Gemini call with
          its own system prompt; each delegation tool appends one completed
          entry to <code>tool_context.state["delegations"]</code>, which
          reaches the browser as an AG-UI state update.
        </p>
        <ui-source path="backend/agents/subagents_agent.py" />
      </ui-panel>

      <ui-panel heading="Serving the supervisor">
        <p class="mb-3 text-sm text-slate-700">
          The supervisor is its own <code>LlmAgent</code>, separate from the
          default agent. It gets its own <code>ADKAgent</code>, mounted at
          <code>/subagents</code>, and <code>server.ts</code> registers it under
          the runtime key <code>subagents</code>.
        </p>
        <ui-source path="backend/main.py" />
      </ui-panel>

      <ui-panel heading="Rendering a live delegation log">
        <ui-source
          path="src/app/features/subagents/subagents-chat.component.ts"
        />
      </ui-panel>

      <ui-panel heading="Reading the delegations slot">
        <ui-source path="src/app/features/subagents/subagent-model.ts" />
      </ui-panel>

      <ui-panel heading="One renderer per sub-agent tool">
        <ui-source
          path="src/app/features/subagents/subagent-renderer-config.ts"
        />
      </ui-panel>

      <ui-panel heading="Transcript card and delegation log">
        <ui-source path="src/app/features/subagents/subagent-cards.ts" />
      </ui-panel>

      <ui-callout title="Not in the guide — where the gaps were filled">
        The guide imports <code>get_model</code> and
        <code>stop_on_terminal_text</code> from <code>agents.shared_chat</code>,
        a showcase-only module it never shows. Here the import takes only
        <code>stop_on_terminal_text</code>, which
        <code>backend/agents/shared_chat.py</code> holds as the quickstart's own
        definition, and <code>get_model(_SUB_MODEL)</code> is written as plain
        <code>_SUB_MODEL</code> — the string the showcase's
        <code>get_model</code> returns when no proxy is configured. Those are
        the only two lines changed in the guide's module. How the supervisor
        is served, the <code>subagents</code> agent id,
        <code>readDelegations</code>, <code>subAgentRendererConfig</code>, and
        both card components come from the CopilotKit showcase the guide is
        cut from.
      </ui-callout>

      <ui-callout tone="warn" title="The step heading mentions AGUIToolset()">
        The guide's setup step is titled “Add AGUIToolset() to your supervisor
        agent”, but its code does not use <code>AGUIToolset</code>: the
        supervisor's <code>tools</code> are the three sub-agent functions
        only. The code is followed as published, so the supervisor does not
        receive frontend tools.
      </ui-callout>
    </div>
  `,
})
export default class SubagentsPage {}
