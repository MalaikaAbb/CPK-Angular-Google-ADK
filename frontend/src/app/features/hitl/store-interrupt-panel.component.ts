/**
 * "Handle an interrupt from the store" — the guide's default interrupt path.
 * https://docs.copilotkit.ai/angular/google-adk/guides/human-in-the-loop
 *
 * An interrupt is a state of one conversation, so the store that already
 * exposes that conversation's messages and state exposes its pending interrupt
 * too. A component holding a store needs nothing else: no `injectInterrupt`,
 * no separate subscription. The controller is created and connected with the
 * store and destroyed when the store is torn down or replaced.
 *
 * `interruptController` is unfiltered and untyped (`InterruptController`, so
 * the payload is `unknown`) — that is the trade for needing no wiring. The
 * typed sibling in `interrupt-panel.component.ts` is what you reach for when
 * that is not enough.
 */
import { Component } from '@angular/core';
import { injectAgentStore } from '@copilotkit/angular';

@Component({
  selector: 'app-store-interrupt-panel',
  template: `
    @let interrupts = store().interruptController;

    @if (interrupts.hasInterrupt()) {
      <section aria-labelledby="store-review-title">
        <h2 id="store-review-title">
          {{ interrupts.interrupt()?.message ?? 'Review required' }}
        </h2>
        <button type="button" (click)="resolve()">Approve</button>
        <button type="button" (click)="cancel()">Reject</button>
      </section>
    }

    @if (interrupts.error()) {
      <p role="alert">The decision could not be submitted.</p>
    }
  `,
})
export class StoreInterruptPanelComponent {
  /**
   * `default` is the ADK agent registered in `server.ts`. The guide's example
   * names its own agent (`"ticketing"`); the call shape is identical.
   */
  protected readonly store = injectAgentStore('default');

  /**
   * The guide calls `resolve`/`cancel` straight from the template. Going
   * through a method here only so the rejected promise is handled — resuming
   * an expired interrupt throws `InterruptExpiredError`.
   */
  protected resolve(): void {
    this.store()
      .interruptController.resolve({ approved: true })
      .catch(() => undefined);
  }

  protected cancel(): void {
    this.store()
      .interruptController.cancel()
      .catch(() => undefined);
  }
}
