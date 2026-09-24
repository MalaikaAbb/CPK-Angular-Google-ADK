# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

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

## 2026-08-18

### 06:50 UTC — 1 page, highest severity high

**High — Frontend tools and generative UI** · _local snapshot edit, not an upstream change_

`/angular/google-adk/guides/frontend-tools-generative-ui` · route `/frontend-tools-generative-ui` · under “Register a browser tool”

6 code lines, 2 prose lines changed.

````diff
+ Call `registerFrontendTool` from an Angular injection context. The live
+ Showcase example builds a typed tool config around a writable signal:
- 
+ handler: async (args) => {
+ const next = resolveGradient(args.background ?? args.color);
+ background.set(next);
+ return { background: next };
+ },
````
