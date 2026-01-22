import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function DetailPanelSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton height={24} width="70%" className="mb-4" />
        
        <div className="space-y-4">
          <div>
            <Skeleton height={16} width="40%" className="mb-2" />
            <Skeleton height={18} count={2} />
          </div>
          
          <div>
            <Skeleton height={16} width="35%" className="mb-2" />
            <Skeleton height={18} />
          </div>
          
          <div>
            <Skeleton height={16} width="30%" className="mb-2" />
            <Skeleton height={18} />
          </div>
          
          <div>
            <Skeleton height={16} width="25%" className="mb-2" />
            <Skeleton height={18} />
          </div>
        </div>
      </div>

      <Skeleton height={1} />

      <div>
        <Skeleton height={24} width="70%" className="mb-4" />
        
        <div className="space-y-4">
          <div>
            <Skeleton height={16} width="30%" className="mb-2" />
            <Skeleton height={18} />
          </div>
          
          <div>
            <Skeleton height={16} width="30%" className="mb-2" />
            <Skeleton height={18} />
          </div>
          
          <div>
            <Skeleton height={16} width="25%" className="mb-2" />
            <Skeleton height={18} count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
