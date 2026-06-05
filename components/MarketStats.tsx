type MarketStatsProps = {
  avgSurge: number;
  activeJobs: number;
  className?: string;
};

export default function MarketStats({
  avgSurge,
  activeJobs,
  className = "",
}: MarketStatsProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 lg:grid-cols-1 ${className}`}>
      <div className="border border-outline-variant p-4 lg:p-5">
        <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
          AVG. SURGE
        </p>
        <p className="font-headline-md text-headline-md text-primary lg:text-[28px]">
          {avgSurge}x
        </p>
      </div>
      <div className="border border-outline-variant p-4 lg:p-5">
        <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
          ACTIVE JOBS
        </p>
        <p className="font-headline-md text-headline-md text-primary lg:text-[28px]">
          {activeJobs}
        </p>
      </div>
    </div>
  );
}
