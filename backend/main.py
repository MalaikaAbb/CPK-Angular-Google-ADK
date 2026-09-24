from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_response import LlmResponse
from ag_ui_adk import AGUIToolset
from google.adk.tools import ToolContext


def stop_on_terminal_text(
    callback_context: CallbackContext, llm_response: LlmResponse
) -> None:
    """The quickstart's Gemini termination safeguard, defined in full.

    https://docs.copilotkit.ai/angular/google-adk/quickstart

    Verbatim from the quickstart. Earlier revisions of that page imported this
    from `agents.shared_chat`, a showcase-only module that is not on PyPI, so
    the callback could not be wired up here; the page now defines it inline.

    It ends the invocation on final text with a `STOP` finish reason, and
    leaves partial responses and pending tool calls alone — without it a Gemini
    turn can keep the run open after the agent has already answered.
    """
    content = llm_response.content
    if llm_response.partial or not content or content.role != "model":
        return
    finish_reason = llm_response.finish_reason
    if getattr(finish_reason, "name", finish_reason) != "STOP":
        return
    parts = content.parts or []
    if not any(part.text for part in parts) or any(part.function_call for part in parts):
        return
    # ADK's invocation context is private; tolerate SDK changes.
    invocation = getattr(callback_context, "_invocation_context", None)
    if invocation is not None:
        try:
            invocation.end_invocation = True
        except AttributeError:
            pass


def getWeather(tool_context: ToolContext, location: str) -> dict:
    """Get the current weather for a given location."""
    return {
        "city": location,
        "temperature": 68,
        "humidity": 55,
        "wind_speed": 10,
        "conditions": "Sunny",
    }


# Two deviations from the quickstart's snippet, both deliberate. The model
# stays `gemini-2.5-flash` rather than the page's `gemini-3.1-flash-lite` —
# the page itself says to use an ADK-supported model available to your
# project, and this one is what this project has. `getWeather` joins
# `AGUIToolset()` in `tools=` because the Frontend tools route renders a
# server-side tool call through `registerRenderToolCall`, which needs a tool
# of that exact name on the agent.
agent = LlmAgent(
    name="assistant",
    model="gemini-2.5-flash",
    instruction="Help the user and call the available frontend tools when appropriate.",
    tools=[AGUIToolset(), getWeather],
    after_model_callback=stop_on_terminal_text,
)

adk_agent = ADKAgent(
    adk_agent=agent,
    app_name="demo_app",
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True
)



app = FastAPI()

# The chat path never needs this: the browser talks to the Copilot Runtime, and
# the runtime calls this agent server-side, where CORS does not apply. It is the
# Angular dev server's connection-check panel that reads GET /capabilities
# directly from the browser — without these headers that fetch is blocked and
# the panel reports "unreachable" even while the server logs a 200.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

add_adk_fastapi_endpoint(app, adk_agent, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)