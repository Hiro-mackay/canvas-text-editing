import { ChangeEvent, useMemo, FC, memo, useCallback } from 'react';

interface TextInputProps {
  value: string;
  input: (text: string) => void;
}

export const TextInput: FC<TextInputProps> = memo(({ value, input }) => {
  const text = useMemo(() => value, [value]);

  return (
    <input
      className="m-5 p-2 border border-gray-500"
      type="text"
      onChange={(e) => {
        input(e.currentTarget.value);
      }}
      value={text}
    />
  );
});
