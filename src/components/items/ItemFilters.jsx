import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ItemFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filteredCount, 
  totalCount 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <div className="card p-4 mb-5 flex flex-col md:flex-row gap-3 items-stretch md:items-center animate-slide-up">
      <div className="flex-1 relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search your pantry..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="input-field !pl-10 !pr-10"
          aria-label="Search items"
        />
        {localSearchTerm && (
          <button
            onClick={() => setLocalSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink p-1 rounded-lg hover:bg-c2 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-c1 rounded-xl px-4 py-2.5 border border-c2">
        <label htmlFor="sort-select" className="text-sm font-semibold text-ink-muted whitespace-nowrap">
          Sort
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent focus:outline-none cursor-pointer font-semibold text-ink text-sm"
          aria-label="Sort items"
        >
          <option value="date">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="quantity">Quantity ↓</option>
        </select>
      </div>

      <div className="badge !normal-case !tracking-normal !text-sm whitespace-nowrap self-center">
        {filteredCount === totalCount ? (
          <span><strong className="text-c5">{totalCount}</strong> items</span>
        ) : (
          <span><strong className="text-c5">{filteredCount}</strong> / {totalCount}</span>
        )}
      </div>
    </div>
  );
};

ItemFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.oneOf(['date', 'name', 'quantity']).isRequired,
  onSortChange: PropTypes.func.isRequired,
  filteredCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired
};

export default ItemFilters;
