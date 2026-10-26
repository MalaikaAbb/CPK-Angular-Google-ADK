# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-10-19

### 12:28 UTC — 1 page, highest severity none

**Info — Sub-agents**

`/angular/google-adk/multi-agent/subagents` · route `/subagents`

Now tracked for the first time.

---

## 2026-10-12

### 12:40 UTC — 5 pages, highest severity high

**High — A2UI schemas, styling, and recovery**

`/angular/google-adk/guides/a2ui` · route `/a2ui` · under “Choose a schema strategy” · in a `typescript` block

24 code lines, 1 heading, 17 prose lines changed. The number of fenced code blocks changed.

````diff
- // features/a2ui/a2ui-catalogs.ts
- const fixedDefinitions = {
+ // features/a2ui/a2ui-definitions.ts
+ export const fixedDefinitions = {
- };
+ } satisfies A2UICatalogDefinitions;
+ A catalog is required: without one, A2UI stays off even when the runtime
+ enables it, and CopilotKit logs a warning.
````

**High — Voice and multimodal input**

`/angular/google-adk/guides/voice-multimodal` · route `/voice-multimodal` · under “Accept voice input”

5 code lines, 1 heading, 15 prose lines changed. The number of fenced code blocks changed.

````diff
- access. Your Runtime must also have transcription configured; a visible
- microphone does not make an unavailable transcription service succeed.
+ access.
+ 
+ ### Configure Runtime transcription
+ 
+ Follow the [Voice backend setup](/angular/google-adk/guides/voice-multimodal#backend) to add a dedicated Runtime
+ route and transcription service. Keep speech-provider credentials separate
````

**Low — Introduction**

`/angular/google-adk` · routes `/`, `/doc-sync` · under “Already have Google ADK sessions?”

2 prose lines changed.

````diff
- When you add a user-facing app to an existing ADK agent, your users may need to open and continue sessions they started elsewhere. [CopilotKit Intelligence](/angular/google-adk/intelligence/overview) can import persisted ADK sessions as Rich Threads, bringing that history into your CopilotKit app.
+ When you add a user-facing app to an existing ADK agent, your users may need to open and continue sessions they started elsewhere. [CopilotKit Intelligence](/angular/google-adk/intelligence/overview) can import persisted ADK sessions as threads, bringing that history into your CopilotKit app.
````

**Low — Frontend tools and generative UI**

`/angular/google-adk/guides/frontend-tools-generative-ui` · route `/frontend-tools-generative-ui` · under “Choose a generative UI path”

2 prose lines changed.

````diff
- | A2UI | A server emits A2UI operations or snapshots | Runtime capability turns on the built-in renderer; an optional `a2ui` config supplies a catalog or theme |
+ | A2UI | A server emits A2UI operations or snapshots | Set `a2ui.catalog` in `provideCopilotKit` to turn on the built-in renderer; without a catalog A2UI stays off |
````

**Info — WebMCP**

`/angular/google-adk/webmcp` · route `/webmcp`

Now tracked for the first time.

---

---

## 2026-09-24

### 08:49 UTC — 5 pages, highest severity high

**High — Introduction**

`/angular/google-adk` · routes `/`, `/doc-sync` · under “Angular”

39 code lines, 3 headings, 50 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted Enterprise Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ ## Start with your coding agent
+ 
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
+ 
````

**High — Frontend tools and generative UI**

`/angular/google-adk/guides/frontend-tools-generative-ui` · route `/frontend-tools-generative-ui` · under “Let the agent display one of your components”

36 code lines, 1 heading, 21 prose lines changed. The number of fenced code blocks changed.

````diff
+ ## Let the agent display one of your components
+ 
+ The simplest generative UI there is, and the only kind that needs nothing on the
+ agent side. `registerComponent` registers a standalone component as a tool the
+ agent can call to show it. The agent decides when, and fills the props.
+ 
+ ```ts title="src/app/incident-card.component.ts"
+ import { Component, input } from "@angular/core";
````

**High — Human-in-the-loop and interrupts**

`/angular/google-adk/guides/human-in-the-loop` · route `/human-in-the-loop` · under “Human-in-the-loop and interrupts”

26 code lines, 3 headings, 26 prose lines changed. The number of fenced code blocks changed.

````diff
- | Interrupt | The backend agent emits an AG-UI interrupt | `injectInterrupt` |
+ | Interrupt | The backend agent emits an AG-UI interrupt | `AgentStore.interruptController`, `injectInterrupt` |
- ## Handle an interrupt
+ ## Handle an interrupt from the store
+ An interrupt is a state of one conversation: this agent, this thread, this run
+ is waiting for a decision. The store that already exposes that conversation's
+ messages and state exposes its pending interrupt too, so a component that holds
+ a store needs nothing else:
````

**High — Quickstart**

`/angular/google-adk/quickstart` · route `/quickstart` · under “Angular”

39 code lines, 2 headings, 36 prose lines changed.

````diff
- body="Add durable threads, inspection, and managed or self-hosted Enterprise Intelligence without changing the Angular frontend APIs in this guide."
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ ## Start with your coding agent
+ 
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ 
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
+ 
````

**Low — A2UI schemas, styling, and recovery**

`/angular/google-adk/guides/a2ui` · route `/a2ui` · under “Angular support boundaries”

2 prose lines changed.

````diff
- - **Hashbrown is unsupported.** The stable Hashbrown Angular package does not support the complete Angular 20 through 22 policy.
+ - **Hashbrown is unsupported.** The stable Hashbrown Angular package does not support the Angular 22 policy.
````

---

---
