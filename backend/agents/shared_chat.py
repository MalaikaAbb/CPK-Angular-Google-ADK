"""
`stop_on_terminal_text`, shared by the default agent in main.py and the
sub-agents supervisor in agents/subagents_agent.py.

The Sub-agents guide imports it from `agents.shared_chat`, a showcase-only
module the page never shows. Rather than copy the showcase's version, this
module holds the quickstart's own definition, moved here unchanged from
main.py so both agents use the same callback.
"""
from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_response import LlmResponse


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
