import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import './recipe.css';

const Recipe = ({ recipe, isCached, onClose, onRetry, loading, error }) => {
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 300);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    const focusable = dialogRef.current?.querySelector('button');
    focusable?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sanitizedRecipe = recipe ? DOMPurify.sanitize(recipe) : null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        ref={dialogRef}
        className={`relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-dialog-title"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-c3 to-c4 text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <h2 id="recipe-dialog-title" className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">🍳</span>
            Your Recipe
            {isCached && (
              <span className="text-sm font-normal bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                Saved
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-smooth active:scale-95"
              aria-label="Close recipe"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-16 w-16 text-c4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-700">Generating your recipe...</p>
              <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-gray-900 mb-2">Failed to generate recipe</p>
              <p className="text-sm text-gray-600 mb-6 text-center max-w-md">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-6 py-3 bg-c4 text-white rounded-lg hover:bg-c3 hover:shadow-lg transition-smooth flex items-center gap-2 font-semibold active:scale-95"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : sanitizedRecipe ? (
            <div
              className="prose prose-lg max-w-none animate-fade-in"
              dangerouslySetInnerHTML={{ __html: sanitizedRecipe }}
            />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No recipe available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Recipe.propTypes = {
  recipe: PropTypes.string,
  isCached: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string
};

Recipe.defaultProps = {
  recipe: null,
  isCached: false,
  onRetry: null,
  loading: false,
  error: null
};

export default Recipe;
