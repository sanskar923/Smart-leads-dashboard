import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalRecords,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) => (
  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Showing page {currentPage} of {totalPages} ({totalRecords} total leads)
    </p>
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
