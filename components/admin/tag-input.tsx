"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({
  id,
  name,
  defaultValue = [],
  suggestions = [],
  placeholder = "Type and press Enter",
}: {
  id?: string;
  name: string;
  defaultValue?: string[];
  suggestions?: string[];
  placeholder?: string;
}) {
  const [tags, setTags] = useState(defaultValue);
  const [draft, setDraft] = useState("");

  function addTag(value: string) {
    const clean = value.trim();
    if (!clean) return;

    setTags((current) =>
      current.some((tag) => tag.toLowerCase() === clean.toLowerCase())
        ? current
        : [...current, clean]
    );
    setDraft("");
  }

  function removeTag(value: string) {
    setTags((current) => current.filter((tag) => tag !== value));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && tags.length > 0) {
      setTags((current) => current.slice(0, -1));
    }
  }

  const remaining = suggestions.filter(
    (suggestion) =>
      !tags.some((tag) => tag.toLowerCase() === suggestion.toLowerCase())
  );

  return (
    <div>
      <input type="hidden" name={name} value={tags.join(", ")} />

      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background/60 px-2 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}

        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-24 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
        />
      </div>

      {remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {remaining.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="rounded-full border border-primary/15 px-2.5 py-1 text-[0.65rem] text-primary/70 transition-colors hover:border-primary/40 hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
