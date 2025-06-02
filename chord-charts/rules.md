# ChordPro Conversion Rules (for PCO Integration)

These rules define how to convert chord/lyric charts (especially Ultimate Guitar-style charts) into inline chord charts compatible with [Planning Center Online](https://pcoservices.zendesk.com/hc/en-us/articles/204262464-Special-Codes-for-Lyrics-and-Chords#lyrics-chords-0).

---

### RULE: Input Source and Layout Assumptions

- Source material will be **pasted manually** from websites like Ultimate Guitar.
- Each chord/lyric pair appears as two lines:
  1. A chord line
  2. A lyric line immediately beneath it
- These lines are laid out using **monospaced fonts**, so **visual column alignment is meaningful and preserved**.

---

### RULE: Chord/Lyric Alignment

- Both lines are treated as **fixed-width strings** (e.g., 80 characters wide).
- Chords are aligned **only when the first character of the chord matches the same column index as the first character of a lyric word**.

#### Chord Insertion Rules:
- If a chord starts at column `n` and a word in the lyric starts at column `n`, place `[Chord]` directly before that word.
- If a chord appears before any lyric (e.g. pickup chords), prepend with spacing but never collapse them.
- Always insert a space between adjacent chords:
  - ✅ `[A] [B]Turn my way`
  - ❌ `[A][B]Turn my way`

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

### RULE: Section Headers

- Bracketed headers like `[Verse 1]`, `[Chorus]`, `[Bridge]` must be converted to:
  - All-uppercase
  - Bracketless
  - One blank line after

#### Example:
```
CHORUS

Oh, [B]give me the beat boys...
```

---

### RULE: Instrumental / Chord-Only Lines

- When chord lines are present **without lyrics**, treat them as instrumental figures.
- Render chords inline with a single space between each:
```
[E5] [D5] [E5] [D5]
```

- If they belong to a labeled section (e.g. `[Guitar Solo]`), render as:
```
GUITAR SOLO

[E] [D] [E] [D]
```

---

### RULE: Special Cases

- **N.C.** is treated as a literal chord:
  - `[N.C.]No accompaniment here`
- Avoid visual symbols like `~`, `*`, or `(...)` unless they appear in the lyrics themselves.

---

### RULE: Enharmonic Correction

- Verify all chords against the song’s key.
- Reject enharmonic spellings not appropriate for the key:
  - In key of B major, substitute:
    - `Cb` → `B`
    - `Fb` → `E`
    - `E#` → `F`

---

### RULE: Output Formatting

- The final output should be plain inline chord text.
- Do **not** include metadata (like `{title:}` or `{artist:}`) in the body — it is only for internal use.
- Ensure the result can be pasted directly into Planning Center and preserve visual alignment.
- Do **not** wrap lines or break phrasing unless explicitly instructed.
- Every chord must be enclosed in `[brackets]`.

---

### RULE: Fail-Safe Behavior

- Never guess alignment.
- Never insert chords where spacing is ambiguous.
- If alignment cannot be determined by visual column match, **leave it out and flag the line for review**.

---

This rule set assumes a consistent input structure. If the input deviates, stop and request clarification.
