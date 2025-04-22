import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Textarea } from "@/components/ui/textarea";
import { useId } from "react";

export default function LimitedCharTextArea() {
  const id = useId();
  const maxLength = 180;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  return (
    <div className="space-y-2">
      <Textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        aria-describedby={`${id}-description`}
      />
      <p
        id={`${id}-description`}
        className="mt-2 text-right text-xs text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{limit - characterCount}</span>{" "}
        characters left
      </p>
    </div>
  );
}
