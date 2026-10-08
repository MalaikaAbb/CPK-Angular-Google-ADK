/**
 * "Angular frontend tool", from the WebMCP guide.
 * https://docs.copilotkit.ai/angular/google-adk/webmcp
 *
 * The guide's component, with two mechanical deviations:
 * `standalone: true` is dropped — it is the default on Angular v20+ and
 * frontend/AGENTS.md forbids setting it — and `searchOrders`, which the guide
 * calls but never defines, is given a minimal local body so the handler runs.
 *
 * `webmcp` is the only WebMCP-specific part. It mirrors this frontend tool
 * onto `document.modelContext`; the handler is the same one a CopilotKit agent
 * would call. The registration is removed when this component is destroyed.
 */
import { Component } from "@angular/core";
import { registerFrontendTool } from "@copilotkit/angular";
import { z } from "zod";

type OrderStatus = "open" | "shipped" | "delivered";

const ORDERS = [
  { id: "ORD-1001", status: "open" },
  { id: "ORD-1002", status: "shipped" },
  { id: "ORD-1003", status: "delivered" },
  { id: "ORD-1004", status: "open" },
];

async function searchOrders(status: OrderStatus) {
  return ORDERS.filter((order) => order.status === status);
}

@Component({
  selector: "app-order-search",
  template: "",
})
export class OrderSearchComponent {
  constructor() {
    registerFrontendTool({
      name: "searchOrders",
      description: "Search the signed-in user's orders by status",
      parameters: z.object({
        status: z.enum(["open", "shipped", "delivered"]),
      }),
      handler: async ({ status }) => {
        const orders = await searchOrders(status);
        return JSON.stringify(orders);
      },
      webmcp: {
        annotations: {
          readOnlyHint: true,
        },
      },
    });
  }
}