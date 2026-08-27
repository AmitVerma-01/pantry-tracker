import { memo, useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useToast } from "./common/Toast";
import { validateItemName, validateQuantity } from "../utils/validation";

const ItemComponent = ({
  docId,
  itemName,
  quantity,
  onUpdate,
  onDelete,
  onCheckboxChange,
  checked
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(itemName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const toast = useToast();
  const quantityTimerRef = useRef(null);

  useEffect(() => {
    setLocalQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    return () => {
      if (quantityTimerRef.current) {
        clearTimeout(quantityTimerRef.current);
      }
    };
  }, []);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedName(itemName);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(itemName);
    setError("");
  };

  const handleSaveEdit = async () => {
    const trimmedName = editedName.trim();
    const validationError = validateItemName(trimmedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (trimmedName === itemName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await onUpdate(docId, { itemName: trimmedName });
      toast.success("Item name updated successfully");
      setIsEditing(false);
      setError("");
    } catch (err) {
      toast.error(err.message || "Failed to update item name");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const commitQuantityChange = useCallback(async (newQuantity) => {
    const quantityNum = parseInt(newQuantity, 10);
    const validationError = validateQuantity(quantityNum);

    if (validationError) {
      toast.error(validationError);
      setLocalQuantity(quantity);
      return;
    }

    if (quantityNum === quantity) {
      return;
    }

    setLoading(true);
    try {
      await onUpdate(docId, { quantity: quantityNum });
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
      setLocalQuantity(quantity);
    } finally {
      setLoading(false);
    }
  }, [docId, onUpdate, quantity, toast]);

  const handleIncreaseQuantity = () => {
    commitQuantityChange(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      commitQuantityChange(quantity - 1);
    }
  };

  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    setLocalQuantity(value);

    if (quantityTimerRef.current) {
      clearTimeout(quantityTimerRef.current);
    }

    quantityTimerRef.current = setTimeout(() => {
      if (value === "" || parseInt(value, 10) >= 1) {
        commitQuantityChange(value || 1);
      }
    }, 500);
  };

  const handleDelete = () => {
    onDelete(docId, itemName);
  };

  const handleCheckboxChange = (e) => {
    onCheckboxChange(docId, e.target.checked);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`w-full border mt-1 flex items-center justify-between border-c2 rounded-lg min-h-12 bg-white hover:bg-c1 transition-smooth hover:shadow-md ${
      loading ? 'opacity-50' : ''
    }`}>
      <div className="flex items-center pl-3 w-3/5 py-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          disabled={loading}
          className="mr-3 w-4 h-4 cursor-pointer accent-c4 transition-transform hover:scale-110"
          aria-label={`Select ${itemName}`}
        />
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2 animate-fade-in">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className={`flex-1 px-3 py-1.5 border-2 rounded-lg transition-smooth ${
                error ? 'border-red-500 focus:border-red-500' : 'border-c4 focus:border-c3'
              } focus:shadow-md`}
              autoFocus
              aria-label="Edit item name"
            />
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="text-green-600 hover:text-green-800 hover:bg-green-50 p-1.5 rounded-lg transition-smooth disabled:opacity-50 active:scale-95"
              aria-label="Save"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg transition-smooth disabled:opacity-50 active:scale-95"
              aria-label="Cancel"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between group">
            <p className="text-center flex-1 font-medium text-gray-800">{itemName}</p>
            <button
              onClick={handleStartEdit}
              disabled={loading}
              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-c4 hover:text-c3 hover:bg-c2 p-1.5 rounded-lg transition-all disabled:opacity-50 active:scale-95"
              aria-label="Edit item name"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="w-1/5 flex justify-center items-center gap-1">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-c2 hover:bg-c3 text-gray-800 font-bold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-md"
          onClick={handleDecreaseQuantity}
          disabled={loading || quantity <= 1}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          onChange={handleQuantityInputChange}
          className="w-12 h-8 rounded-lg text-center bg-white border-2 border-c3 shadow-sm disabled:opacity-50 font-semibold text-gray-800 focus:border-c4 transition-smooth"
          value={localQuantity}
          min="1"
          disabled={loading}
          aria-label="Quantity"
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-c2 hover:bg-c3 text-gray-800 font-bold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-md"
          onClick={handleIncreaseQuantity}
          disabled={loading}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="w-1/5 flex justify-center items-center">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 hover:bg-red-50 rounded-lg transition-smooth disabled:opacity-50 active:scale-95 group"
          aria-label="Delete item"
        >
          <img src="delete.png" alt="" className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {error && (
        <div className="absolute mt-12 text-red-500 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

ItemComponent.propTypes = {
  docId: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

ItemComponent.defaultProps = {
  checked: false
};

export default memo(ItemComponent);
