from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from google.adk.agents import LlmAgent
from ag_ui_adk import AGUIToolset
from google.adk.tools import ToolContext

def getWeather(tool_context: ToolContext, location: str) -> dict:
    """Get the current weather for a given location."""
    return {
        "city": location,
        "temperature": 68,
        "humidity": 55,
        "wind_speed": 10,
        "conditions": "Sunny",
    }


agent = LlmAgent(
    name="assistant",
    model="gemini-2.5-flash",
    instruction="Be helpful and fun!",
    tools=[AGUIToolset(), getWeather],
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