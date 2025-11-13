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

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4 animate-slide-up">
      {/* Search Input */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search items..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-3 rounded-lg border-2 border-c3 bg-white focus:border-c4 transition-smooth hover:shadow-md focus:shadow-md"
          aria-label="Search items"
        />
        {localSearchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border-2 border-c3 transition-smooth hover:shadow-md">
        <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent focus:outline-none cursor-pointer font-medium text-gray-800"
          aria-label="Sort items"
        >
          <option value="date">Date Added (Newest)</option>
          <option value="name">Name (A-Z)</option>
          <option value="quantity">Quantity (High-Low)</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-center md:justify-start">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap px-4 py-3 bg-c2 rounded-lg shadow-md">
          {filteredCount === totalCount ? (
            <span>
              <strong className="text-c4">{totalCount}</strong> {totalCount === 1 ? 'item' : 'items'}
            </span>
          ) : (
            <span>
              <strong className="text-c4">{filteredCount}</strong> of <strong>{totalCount}</strong> items
            </span>
          )}
        </span>
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
