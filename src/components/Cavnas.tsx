import { FC, memo, useEffect, useRef } from 'react';

interface CavnasProps {
  initApp: (ref: HTMLCanvasElement) => void;
}

export const Cavnas: FC<CavnasProps> = memo(({ initApp }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref) return;

    initApp(ref.current);
  }, [ref]);
  return (
    <canvas width="500" height="400" ref={ref}>
      Renderer Cavnas
    </canvas>
  );
});
