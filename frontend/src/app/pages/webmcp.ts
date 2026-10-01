import { Component } from '@angular/core';

import { RouteHeader } from '../components/route-header';
import { Callout, Panel, SourceCode, TryIt } from '../components/ui';

@Component({
  selector: 'app-webmcp-page',
  imports: [RouteHeader, Panel, Callout, TryIt, SourceCode],
  template: `
    <app-route-header path="/webmcp" />

    <div class="space-y-6">
      <ui-try-it>
        <p class="mt-1 text-slate-700">
          In Chrome 149+ with WebMCP enabled, open the demo and confirm
          <code>document.modelContext</code> exists in the DevTools console.
          Then open Chrome's Model Context Tool Inspector.
        </p>
        <p class="mt-2 text-slate-700">
          <strong>Pass:</strong> the inspector lists
          <code>searchOrders</code> with its description, a
          <code>status</code> enum of open / shipped / delivered, and the
          read-only annotation; calling it with
          <code>{{ '{' }}"status":"open"{{ '}' }}</code> returns the matching
          orders. <strong>Fail:</strong> the tool is missing — check the
          browser setup first, then the description, <code>webmcp</code>, and
          that the demo page is still open.
        </p>
      </ui-try-it>

      <ui-panel heading="Angular frontend tool">
        <p class="mb-3 text-sm text-slate-700">
          The only WebMCP-specific line is <code>webmcp</code> on a frontend
          tool registered in an Angular injection context. CopilotKit mirrors
          the tool's name, description, JSON Schema, annotations, and handler
          onto <code>document.modelContext</code>.
        </p>
        <ui-source
          path="src/app/features/webmcp/order-search.component.ts"
          note="searchOrders body is ours; the guide calls it without defining it"
        />
      </ui-panel>

      <ui-callout title="No agent is involved in a WebMCP call">
        A compatible browser agent calls the handler directly on the page, and
        the handler context has no <code>agent</code>. The call is not routed
        through the Copilot Runtime or the ADK backend.
      </ui-callout>

      <ui-callout tone="warn" title="WebMCP is experimental">
        It is a draft Community Group report, not a W3C Standard. CopilotKit
        safely does nothing when <code>document.modelContext</code> is
        unavailable. Annotations are hints, not security controls — enforce
        authentication and validation inside the handler.
      </ui-callout>
    </div>
  `,
})
export default class WebmcpPage {}