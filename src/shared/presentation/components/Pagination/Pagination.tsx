import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '@/shared/presentation/styles/Pagination.css';
import { Button } from '../Button/Button';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  hasMore,
  isLoading = false
}) => {
  return (
    <div className="pagination">
      <span className="pagination-info">Page {currentPage}</span>
      <div className="pagination-controls">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft size={16} />}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasMore || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight size={16} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
