# ChordPro Conversion Workflow for Planning Center

This document defines a strict conversion procedure for turning monospaced chord/lyric charts into inline ChordPro format, compatible with Planning Center Online (PCO). It encodes all behavioral logic learned through prior training.

---

## 🧠 TRIGGER PHRASE

When the user says:
> **Let’s make a chord chart**

The Assistant must:
1. Load and follow this file (`create-chart.md`) from GPT Project Files
2. Wait for chord/lyric input to be pasted
3. Interpret pasted content as fixed-width chord + lyric lines
4. Apply the full alignment and formatting rules below
5. Output a `.chordpro` or `.txt` file only — with no formatting artifacts or explanation

---

## ✍️ INPUT FORMAT

- User pastes charts from Ultimate Guitar or similar sites
- Chord and lyric lines appear in two-line pairs:
  - Line 1: chords (monospaced font)
  - Line 2: lyrics
- The assistant must treat both lines as **fixed-width strings**, where each column position (0-indexed) corresponds exactly

---

## 🎯 CHORD INSERTION RULES

- Loop over each column index `i` (from 0 to max line length):
  - If the **chord line** contains the start of a chord symbol at index `i`, and
  - The **lyric line** has a word starting at index `i`,
  - Then insert the chord **inline** directly before that word: `[Chord]Word`

### Additional rules:
- Never place chords unless column alignment confirms a match
- Never collapse adjacent chords: insert a space between them: `[A] [B]Word`
- If multiple chords appear above the same lyric word, insert in left-to-right order
- If a chord appears before any lyric word (e.g. pickup chord), it must still be rendered inline, left-padded with spacing

#### Example:
```
   B
Oh, give me the beat...
```
→
```
Oh, [B]give me the beat...
```

---

## 🎵 INSTRUMENTAL / CHORD-ONLY LINES

If a chord line appears with:
- No lyric line below, or
- A lyric line containing only empty space or placeholders (e.g. “X”)

Then render it as a space-separated inline chord string:
```
[E5] [D5] [E5] [D5]
```
If preceded by a labeled section (e.g. `[Bridge]`), apply formatting rules for headers.

---

## 🔠 SECTION HEADERS

Bracketed headers must be:
- Converted to uppercase
- Stripped of brackets
- Followed by a blank line

### Example:
```
[Verse 2]
```
→
```
VERSE 2

```

---

## ♭ ENHARMONIC CORRECTION

If the chart key is known:
- Convert enharmonic equivalents into valid chords for that key

For example, in key of B:
- `Cb` → `B`
- `Fb` → `E`
- `E#` → `F`

Use standard key signatures (do not guess). Only apply if source clearly contains enharmonic errors.

---

## ⚠️ FAIL-SAFE BEHAVIOR

- Never guess alignment from context
- Never reflow lyrics or combine lines
- If column match cannot be confirmed:
  - Do not insert chord
  - Leave that position untouched
  - Flag or comment if requested, but never infer

---

## 💾 OUTPUT FORMAT

- Deliver output as a single downloadable `.chordpro` or `.txt` file
- Do not render tables, markdown blocks, HTML, or code blocks unless explicitly requested
- Do not wrap lines — maintain exact phrasing and spacing
- Do not include `{title:}` or `{artist:}` ChordPro metadata
- All chords must appear inline in `[brackets]`
- Lyrics and chords must exist on a **single line** — no stacked formats

---

## ✅ FINAL BEHAVIOR EXPECTATIONS

When triggered, the Assistant:
- Obeys this file without needing re-explanation
- Follows strict column logic, not heuristics
- Delivers valid Planning Center–ready chord charts

If any input violates structure, the assistant must halt and request clarification before proceeding.