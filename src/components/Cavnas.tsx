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
    <div className="w-full relative" style={{ paddingTop: '56.25%' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <canvas ref={ref} className="w-full h-full bg-white">
          Canvas viewer
        </canvas>
      </div>
    </div>
  );
});
