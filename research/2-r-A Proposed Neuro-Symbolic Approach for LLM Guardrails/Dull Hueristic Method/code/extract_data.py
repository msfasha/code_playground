import json, csv, sys, os

in_path = sys.argv[1] if len(sys.argv) > 1 else "arabic_adversarial_results_20250914_222929.json"

with open(in_path, "r", encoding="utf-8") as f:
    data = json.load(f)

rows = []
for ex in data.get("examples", []):
    rows.append({
        "id": ex["id"],
        "attack_type": ex.get("attack_type",""),
        "language_variant": ex.get("language_variant",""),
        "cultural_context": ex.get("cultural_context",""),
        "harm_category": ex.get("harm_category",""),
        "prompt": ex.get("adversarial_prompt",""),
        "original_prompt": ex.get("original_prompt",""),
    })

# CSV (one row per example)
out_csv = os.path.splitext(in_path)[0] + "_prompts.csv"
with open(out_csv, "w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader(); w.writerows(rows)
print("Wrote", out_csv)

# JSONL (unique prompts only)
seen = set()
out_jsonl = os.path.splitext(in_path)[0] + "_prompts.jsonl"
with open(out_jsonl, "w", encoding="utf-8") as out:
    for r in rows:
        p = (r["prompt"] or "").strip()
        if not p or p in seen: 
            continue
        seen.add(p)
        out.write(json.dumps({
            "id": r["id"],
            "attack_type": r["attack_type"],
            "language_variant": r["language_variant"],
            "cultural_context": r["cultural_context"],
            "prompt": r["prompt"],
        }, ensure_ascii=False) + "\n")
print("Wrote", out_jsonl)
