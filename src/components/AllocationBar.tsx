import { getSectorColor } from '../theme/colors';
import type { SectorAllocation } from '../services/portfolioService';

interface AllocationBarProps {
  allocations: SectorAllocation[];
}

export default function AllocationBar({ allocations }: AllocationBarProps) {

  return (
    <div className="bg-card-surface rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-medium text-text-default mb-4">
        Portfolio Allocation
      </h2>

      <div className="flex h-6 rounded-xl overflow-hidden my-4">
        {allocations.map((allocation) => (
          <div
            key={allocation.sector}
            className="transition-all duration-300"
            style={{
              width: `${allocation.percentage}%`,
              backgroundColor: getSectorColor(allocation.sector),
            }}
            title={`${allocation.sector}: ${allocation.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {allocations.map((allocation) => (
          <div
            key={allocation.sector}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getSectorColor(allocation.sector) }}
            />
            <div className="flex flex-col">
              <span className="text-xs text-text-default font-medium">
                {allocation.sector}
              </span>
              <span className="text-xs text-text-neutral">
                {allocation.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
