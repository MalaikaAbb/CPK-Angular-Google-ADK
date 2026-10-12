from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from google.adk.agents import LlmAgent
from ag_ui_adk import AGUIToolset
from google.adk.tools import ToolContext

# The quickstart's termination callback lives in agents/shared_chat.py so the
# sub-agents supervisor can share it.
from agents.shared_chat import stop_on_terminal_text
from agents.subagents_agent import subagents_root_agent


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

# Sub-agents supervisor from
# https://docs.copilotkit.ai/angular/google-adk/multi-agent/subagents
# The guide defines `subagents_root_agent` but not how it is served. This
# follows the showcase's agent_server.py, which wraps each demo agent in its own
# ADKAgent and mounts it at /<demo name>; the sub-agents demo is `subagents`.
subagents_adk_agent = ADKAgent(
    adk_agent=subagents_root_agent,
    user_id="demo_user",
    session_timeout_seconds=3600,
    use_in_memory_services=True,
)
add_adk_fastapi_endpoint(app, subagents_adk_agent, path="/subagents")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)