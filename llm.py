from google import genai
from google.genai import types

client = genai.Client(api_key="AIzaSyAI5vjdiSoBoGNQzXgaKtrn-4xhg1lMbmo")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how AI works in a few words",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)
print(response.text)