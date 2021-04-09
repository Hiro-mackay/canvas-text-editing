import dynamic from 'next/dynamic';

const CanvasConatiner = dynamic(() => import('../containers/CanvasContainer'), { ssr: false });

const Page = () => {
  return (
    <div>
      <main>
        <CanvasConatiner />
      </main>
    </div>
  );
};

export default Page;
