/**
 * "Handle an interrupt with a typed controller", verbatim. The controller is
 * headless, so this panel renders nothing until the backend emits an AG-UI
 * interrupt.
 *
 * `injectInterrupt` takes the agent id positionally; the options object is a
 * retained compatibility overload. Reach for this over the store's built-in
 * controller when you need a typed payload, an `enabled` filter, or a
 * `handler` — this panel types the payload as `ReviewRequest`.
 * https://docs.copilotkit.ai/angular/google-adk/guides/human-in-the-loop
 */
import { Component } from '@angular/core';
import { injectInterrupt } from '@copilotkit/angular';

type ReviewRequest = {
  title?: string;
  choices?: Array<{ id: string; label: string }>;
};

@Component({
  selector: 'app-interrupt-panel',
  template: `
    @if (controller.event(); as event) {
      @let request = asReviewRequest(event.value);
      <section aria-labelledby="review-title">
        <h2 id="review-title">{{ request.title ?? "Review required" }}</h2>

        @for (choice of request.choices ?? []; track choice.id) {
          <button type="button" (click)="resolve(choice.id)">
            {{ choice.label }}
          </button>
        }

        <button type="button" (click)="cancel()">Cancel</button>
      </section>
    }

    @if (controller.error()) {
      <p role="alert">The decision could not be submitted.</p>
    }
  `,
})
export class InterruptPanelComponent {
  protected readonly controller = injectInterrupt<ReviewRequest>('default');

  protected asReviewRequest(value: unknown): ReviewRequest {
    return typeof value === 'object' && value !== null
      ? (value as ReviewRequest)
      : {};
  }

  protected resolve(choiceId: string): void {
    this.controller.resolve({ choiceId }).catch(() => undefined);
  }

  protected cancel(): void {
    this.controller.cancel().catch(() => undefined);
  }
}
