import { useState, useCallback } from "react";

interface UseCharacterLimitProps {
  maxLength: number;
}

interface UseCharacterLimitReturn {
  value: string;
  characterCount: number;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength: number;
}

export function useCharacterLimit({
  maxLength,
}: UseCharacterLimitProps): UseCharacterLimitReturn {
  const [value, setValue] = useState<string>("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value: newValue } = event.target;
      if (newValue.length <= maxLength) {
        setValue(newValue);
      }
    },
    [maxLength]
  );

  return {
    value,
    characterCount: value.length,
    handleChange,
    maxLength,
  };
}
