import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function BriefSkeleton() {
  return (
    <div className="mb-4">
      <div className="mb-6">
        <Skeleton height={28} width="60%" />
      </div>

      <div className="prose prose-slate max-w-none space-y-4">
        <Skeleton height={20} count={3} />
        <Skeleton height={20} count={2} />
        
        <div className="mt-8">
          <Skeleton height={24} width="40%" className="mb-4" />
          <Skeleton height={20} count={4} />
        </div>

        <div className="mt-8">
          <Skeleton height={24} width="50%" className="mb-4" />
          <Skeleton height={20} count={3} />
        </div>
      </div>
    </div>
  );
}
