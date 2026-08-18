# Doc drift changelog

What the CopilotKit docs changed under this repo, written by the sync on
`/doc-sync`. Only pages that actually moved are recorded — a sync that finds
everything unchanged writes nothing here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

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
