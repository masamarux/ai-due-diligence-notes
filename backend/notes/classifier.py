import os
import requests

RISK_KEYWORDS = ["lawsuit", "fraud", "debt", "risk", "regulatory"]
OPPORTUNITY_KEYWORDS = ["growth", "revenue", "market", "opportunity", "partnership"]

def classify_note_with_rules(content: str) -> str:
    normalized_content = content.lower()

    if any(word in normalized_content for word in RISK_KEYWORDS):
        return "risk"

    if any(word in normalized_content for word in OPPORTUNITY_KEYWORDS):
        return "opportunity"

    return "neutral"

def classify_note_with_ai(content: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return classify_note_with_rules(content)
    
    prompt = f"""
      Classify the following business note into one of these categories:
      - risk
      - opportunity
      - neutral

      Only return one word.

      Note:
      "{content}"
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openrouter/free",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You classify due diligence notes. "
                        "Return only one word: risk, opportunity, or neutral."
                    ),
                },
                {
                    "role": "user",
                    "content": content,
                },
            ],
            "temperature": 0,
        },
        timeout=20,
    )

    response.raise_for_status()

    data = response.json()
    result = data["choices"][0]["message"]["content"].strip().lower()

    print(f"AI classification result: {result}")

    if "risk" in result:
        return "risk"

    if "opportunity" in result:
        return "opportunity"

    if "neutral" in result:
        return "neutral"

    return classify_note_with_rules(content)

def classify_note(content: str) -> str:
    try:
        return classify_note_with_ai(content)
    except Exception:
        return classify_note_with_rules(content)
