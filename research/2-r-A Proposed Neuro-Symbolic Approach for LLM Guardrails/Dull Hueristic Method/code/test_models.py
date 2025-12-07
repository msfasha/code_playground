#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LLM Keys Sanity Check — cheap-model connectivity test (2025-09-14)

Providers covered (cheap/default models, with graceful fallbacks):
- OpenAI:            gpt-4o-mini                      (fallbacks: gpt-4o, gpt-4o-mini-2024-07-18)
- Google Gemini:     gemini-2.5-flash or 2.0-flash;   fallback: gemini-1.5-flash, gemini-1.5-flash-8b
- Anthropic:         Claude 3.5 Haiku                 (fallbacks: claude-3-haiku-20240307, other *haiku* variants)
- xAI (Grok):        grok-2-latest                    (fallbacks: grok-2, grok-3, grok-code-fast-1)
- DeepSeek:          deepseek-chat                    (fallback: deepseek-reasoner)

SETUP
  pip install -U python-dotenv openai anthropic google-generativeai
  # put your keys in a .env next to this file
  #  OPENAI_API_KEY=...
  #  GOOGLE_API_KEY=...
  #  ANTHROPIC_API_KEY=...
  #  GROK_API_KEY=...
  #  DEEPSEEK_API_KEY=...

RUN
  python llm_keys_sanity_check.py

Notes:
- This script prints a compact PASS/FAIL line per provider, model used, latency, and a trimmed reply.
- It never echoes your keys. Failures will show concise error messages.
"""

from __future__ import annotations
import os, sys, time, textwrap
from dataclasses import dataclass

# --- Load .env if present ---
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# ---------- utils ----------
@dataclass
class Result:
    provider: str
    ok: bool
    model: str | None
    latency: float
    message: str


def trim(s: str, n: int = 120) -> str:
    s = (s or "").strip().replace("\n", " ")
    return (s[:n] + "…") if len(s) > n else s


def print_result(r: Result) -> None:
    status = "PASS" if r.ok else "FAIL"
    model = r.model or "—"
    print(f"[{status:<4}] {r.provider:<10} | model: {model:<28} | {r.latency*1000:6.0f} ms | {trim(r.message)}")


# ---------- OpenAI ----------
def test_openai() -> Result:
    t0 = time.time()
    try:
        from openai import OpenAI
        key = os.getenv("OPENAI_API_KEY")
        if not key:
            return Result("openai", False, None, 0.0, "OPENAI_API_KEY missing")
        client = OpenAI(api_key=key)
        # Cheap-first candidates
        candidates = [
            "gpt-4o-mini",
            "gpt-4o",
            "gpt-4o-mini-2024-07-18",
        ]
        for m in candidates:
            try:
                resp = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "Ping."}],
                    max_tokens=8,
                    temperature=0.0,
                )
                dt = time.time() - t0
                text = (resp.choices[0].message.content or "").strip()
                return Result("openai", True, m, dt, text)
            except Exception as e:
                last_err = str(e)
        dt = time.time() - t0
        return Result("openai", False, None, dt, last_err)
    except Exception as e:
        dt = time.time() - t0
        return Result("openai", False, None, dt, f"{type(e).__name__}: {e}")


# ---------- Google Gemini ----------
def test_gemini() -> Result:
    t0 = time.time()
    try:
        import google.generativeai as genai
        from google.generativeai.types import GenerationConfig
        key = os.getenv("GOOGLE_API_KEY")
        if not key:
            return Result("gemini", False, None, 0.0, "GOOGLE_API_KEY missing")
        genai.configure(api_key=key)
        # Cheap-and-available candidates (newest first; graceful fallbacks)
        candidates = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
        ]
        for m in candidates:
            try:
                model = genai.GenerativeModel(m)
                resp = model.generate_content(
                    "Ping.",
                    generation_config=GenerationConfig(max_output_tokens=8, temperature=0.0),
                )
                dt = time.time() - t0
                text = getattr(resp, "text", "").strip()
                if text:
                    return Result("gemini", True, m, dt, text)
            except Exception as e:
                last_err = str(e)
        dt = time.time() - t0
        return Result("gemini", False, None, dt, last_err)
    except Exception as e:
        dt = time.time() - t0
        return Result("gemini", False, None, dt, f"{type(e).__name__}: {e}")


# ---------- Anthropic ----------
def test_anthropic() -> Result:
    t0 = time.time()
    try:
        import anthropic
        key = os.getenv("ANTHROPIC_API_KEY")
        if not key:
            return Result("anthropic", False, None, 0.0, "ANTHROPIC_API_KEY missing")
        client = anthropic.Anthropic(api_key=key)
        # Try listing models first (confirms key + perms)
        chosen = None
        try:
            try:
                models = [m.id for m in client.models.list().data]
            except Exception:
                models = []
            # Prefer any *haiku* model for low cost
            for m in models:
                if "haiku" in m:
                    chosen = m
                    break
        except Exception:
            pass
        # Fallbacks if we couldn't list
        candidates = [
            chosen,
            "claude-3-5-haiku-20241022",
            "claude-3-haiku-20240307",
            # in case of newer date-stamped Haiku variants
            "claude-3-7-haiku-20250219",
        ]
        candidates = [c for c in candidates if c]
        last_err = "no candidate models"
        for m in candidates:
            try:
                resp = client.messages.create(
                    model=m,
                    max_tokens=8,
                    messages=[{"role": "user", "content": "Ping."}],
                )
                dt = time.time() - t0
                # Anthropic SDK returns structured content; join text parts
                parts = []
                for c in getattr(resp, "content", []) or []:
                    if getattr(c, "type", None) == "text":
                        parts.append(c.text)
                text = (" ".join(parts)).strip() or "(no text)"
                return Result("anthropic", True, m, dt, text)
            except Exception as e:
                last_err = str(e)
        dt = time.time() - t0
        return Result("anthropic", False, None, dt, last_err)
    except Exception as e:
        dt = time.time() - t0
        return Result("anthropic", False, None, dt, f"{type(e).__name__}: {e}")


# ---------- xAI (Grok) ----------
def test_xai() -> Result:
    t0 = time.time()
    try:
        from openai import OpenAI
        key = os.getenv("GROK_API_KEY")
        if not key:
            return Result("xai", False, None, 0.0, "GROK_API_KEY missing")
        client = OpenAI(api_key=key, base_url="https://api.x.ai/v1")
        # Try listing models first (many xAI accounts support this)
        chosen = None
        try:
            models = [m.id for m in client.models.list().data]
            for m in models:
                if "grok" in m:
                    chosen = m
                    break
        except Exception:
            pass
        candidates = [
            chosen,
            "grok-2-latest",
            "grok-2",
            "grok-3",
            "grok-code-fast-1",
        ]
        candidates = [c for c in candidates if c]
        last_err = "no candidate models"
        for m in candidates:
            try:
                resp = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "Ping."}],
                    max_tokens=8,
                    temperature=0.0,
                )
                dt = time.time() - t0
                text = (resp.choices[0].message.content or "").strip()
                return Result("xai", True, m, dt, text)
            except Exception as e:
                last_err = str(e)
        dt = time.time() - t0
        return Result("xai", False, None, dt, last_err)
    except Exception as e:
        dt = time.time() - t0
        return Result("xai", False, None, dt, f"{type(e).__name__}: {e}")


# ---------- DeepSeek ----------
def test_deepseek() -> Result:
    t0 = time.time()
    try:
        from openai import OpenAI
        key = os.getenv("DEEPSEEK_API_KEY")
        if not key:
            return Result("deepseek", False, None, 0.0, "DEEPSEEK_API_KEY missing")
        client = OpenAI(api_key=key, base_url="https://api.deepseek.com/v1")
        # Prefer deepseek-chat
        chosen = None
        try:
            models = [m.id for m in client.models.list().data]
            for m in models:
                if m.startswith("deepseek-") and ("chat" in m or "lite" in m):
                    chosen = m
                    break
        except Exception:
            pass
        candidates = [chosen, "deepseek-chat", "deepseek-reasoner"]
        candidates = [c for c in candidates if c]
        last_err = "no candidate models"
        for m in candidates:
            try:
                resp = client.chat.completions.create(
                    model=m,
                    messages=[{"role": "user", "content": "Ping."}],
                    max_tokens=8,
                    temperature=0.0,
                )
                dt = time.time() - t0
                text = (resp.choices[0].message.content or "").strip()
                return Result("deepseek", True, m, dt, text)
            except Exception as e:
                last_err = str(e)
        dt = time.time() - t0
        return Result("deepseek", False, None, dt, last_err)
    except Exception as e:
        dt = time.time() - t0
        return Result("deepseek", False, None, dt, f"{type(e).__name__}: {e}")


def main() -> int:
    print("🔎 LLM API key sanity check — cheap models\n")
    results = [
        test_openai(),
        test_gemini(),
        test_anthropic(),
        test_xai(),
        test_deepseek(),
    ]
    # pretty print
    for r in results:
        print_result(r)
    # quick summary exit code
    ok = all(r.ok for r in results if r.provider)
    print("\nDone.")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
