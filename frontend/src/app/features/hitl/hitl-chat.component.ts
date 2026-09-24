/**
 * Puts the guide's two human-in-the-loop paths side by side: the decision tool
 * (registered by ApprovalToolsService, rendered inside the chat's tool-call
 * flow) and a headless interrupt controller (rendered outside the chat).
 * https://docs.copilotkit.ai/angular/google-adk/guides/human-in-the-loop
 *
 * Injecting ApprovalToolsService is what constructs it, and construction is
 * what performs the `registerHumanInTheLoop` call.
 *
 * The guide gives two ways to reach an interrupt, and warns against rendering
 * both for the same decision: each observes the agent independently, so one
 * interrupt becomes visible in both panels and two clicks could try to resume
 * the same run. Both panels here watch the `default` agent, so this switch
 * mounts exactly one — the store controller by default, matching the guide.
 */
import { Component, inject, signal } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';

import { ApprovalToolsService } from './approval-tools.service';
import { InterruptPanelComponent } from './interrupt-panel.component';
import { StoreInterruptPanelComponent } from './store-interrupt-panel.component';

type InterruptPath = 'store' | 'typed';

@Component({
  selector: 'app-hitl-chat',
  imports: [CopilotChat, InterruptPanelComponent, StoreInterruptPanelComponent],
  providers: [ApprovalToolsService],
  template: `
    <div style="display: flex; flex-direction: column; height: 100%">
      <fieldset>
        <legend>Interrupt path</legend>
        <label>
          <input
            type="radio"
            name="interrupt-path"
            value="store"
            [checked]="path() === 'store'"
            (change)="path.set('store')"
          />
          Store controller
        </label>
        <label>
          <input
            type="radio"
            name="interrupt-path"
            value="typed"
            [checked]="path() === 'typed'"
            (change)="path.set('typed')"
          />
          Typed controller
        </label>
      </fieldset>

      @if (path() === 'store') {
        <app-store-interrupt-panel />
      } @else {
        <app-interrupt-panel />
      }

      <div style="flex: 1; min-height: 0">
        <copilot-chat />
      </div>
    </div>
  `,
})
export class HitlChatComponent {
  protected readonly path = signal<InterruptPath>('store');

  private readonly approvalTools = inject(ApprovalToolsService);
}
