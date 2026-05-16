import Workspace from '@/components/layout/Workspace';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="h-screen w-screen overflow-hidden">
        <Workspace />
      </main>
    </ErrorBoundary>
  );
}
