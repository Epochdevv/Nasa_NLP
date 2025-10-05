import os, re, json

txt_dir = "/home/ady/prjs/hh/Nasa_NLP/txt"

for f in os.listdir(txt_dir):
    if not f.endswith(".txt"):
        continue
    path = os.path.join(txt_dir, f)
    text = open(path).read()

    # Fix common malformed pattern: {"label": {"label": ...
    fixed_text = re.sub(
        r'{"label":\s*{"label":',
        '{"label":',
        text
    )

    # Try validating
    try:
        json.loads(fixed_text)
        with open(path, "w") as fw:
            fw.write(fixed_text)
        print(f"{f} ✅ repaired successfully.")
    except json.JSONDecodeError as e:
        print(f"{f} ❌ still invalid JSON: {e}")
