import React, { FC, useCallback } from 'react';

interface TextAddProps {
  add: () => void;
}

export const TextAdd: FC<TextAddProps> = ({ add }) => {
  return <input type="button" value="add text" onClick={add} />;
};
