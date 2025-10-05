from google import genai
from google.genai import types
import os

def process_xml_with_llm(xml_file_path: str, system_prompt_file_path: str, api_key: str) -> str:
    """
    Reads an XML file, uses its content along with a system prompt to call the
    Gemini API, and returns the generated content's text.
    """
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        return f"Error initializing Gemini client: {e}"

    try:
        with open(xml_file_path, "r") as f:
            xml_text = f.read()
    except Exception as e:
        return f"Error reading XML file: {e}"

    try:
        with open(system_prompt_file_path, "r") as f:
            system_instruction = f.read()
    except Exception as e:
        return f"Error reading system prompt file: {e}"

    try:
        result = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                system_instruction=system_instruction
            ),
            contents=[xml_text, "\n\nfollow the rules"],
        )
        return result.text or "No output returned."
    except Exception as e:
        return f"Error during Gemini API call: {e}"


xml_folder = "/home/ady/prjs/hh/Nasa_NLP/xmls"
txt_folder = "/home/ady/prjs/hh/Nasa_NLP/txt"
prompt_path = "system_prompt.txt"
api_key_placeholder = "AIzaSyAI5vjdiSoBoGNQzXgaKtrn-4xhg1lMbmo"

os.makedirs(txt_folder, exist_ok=True)

xml_files = [f for f in os.listdir(xml_folder) if f.endswith(".xml")]

for idx, xml_file in enumerate(xml_files, start=1):
    xml_path = os.path.join(xml_folder, xml_file)
    output_path = os.path.join(txt_folder, os.path.splitext(xml_file)[0] + ".txt")

    text = process_xml_with_llm(xml_path, prompt_path, api_key_placeholder)
    with open(output_path, "w") as f:
        f.write(text)

    print(f"{idx} file done")
