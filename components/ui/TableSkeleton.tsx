import { Skeleton } from "./Skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols: number;
}

export function TableSkeleton({ rows = 5, cols }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-50">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-3 py-3">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
