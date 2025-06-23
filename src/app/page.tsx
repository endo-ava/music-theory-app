import { CircleOfFifths } from '@/components/CircleOfFifths/CircleOfFifths';

export default function Home() {
  return (
    <div>
      <main className="py-8 flex flex-col items-center">
        <h1 className="text-title text-center mb-4">五度圏</h1>
        <CircleOfFifths />
      </main>
    </div>
  );
}
