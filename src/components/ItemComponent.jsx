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
    const validation = validateItemName(trimmedName);

    if (!validation.isValid) {
      setError(validation.error);
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
    const validation = validateQuantity(quantityNum);

    if (!validation.isValid) {
      toast.error(validation.error);
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
    <div className={`group flex items-center gap-2 px-3 py-2.5 mx-2 my-1.5 rounded-xl border transition-all duration-200 ${
      checked
        ? 'bg-c1 border-c4 shadow-soft'
        : 'bg-white border-c3/40 hover:border-c3 hover:bg-surface-muted'
    } ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        disabled={loading}
        className="w-4 h-4 cursor-pointer accent-c4 shrink-0"
        aria-label={`Select ${itemName}`}
      />

      {/* Name — flex-1 on all sizes */}
      <div className="flex-1 min-w-0 py-0.5">
        {isEditing ? (
          <div className="flex items-center gap-1.5 animate-fade-in">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className={`flex-1 px-3 py-1.5 rounded-lg border-2 text-sm ${
                error ? 'border-red-400' : 'border-c4'
              } focus:shadow-soft`}
              autoFocus
              aria-label="Edit item name"
            />
            <button onClick={handleSaveEdit} disabled={loading} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" aria-label="Save">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={handleCancelEdit} disabled={loading} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" aria-label="Cancel">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-semibold text-ink truncate flex-1">{itemName}</p>
            <button
              onClick={handleStartEdit}
              disabled={loading}
              className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-c5 hover:bg-c2 rounded-lg transition-all shrink-0"
              aria-label="Edit item name"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-1 shrink-0 bg-c1 rounded-xl px-1 py-0.5 border border-c2">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-c3 text-ink font-bold text-sm transition-colors disabled:opacity-40"
          onClick={handleDecreaseQuantity}
          disabled={loading || quantity <= 1}
          aria-label="Decrease quantity"
        >−</button>
        <input
          type="number"
          onChange={handleQuantityInputChange}
          className="w-10 h-7 text-center bg-transparent font-bold text-ink text-sm focus:outline-none"
          value={localQuantity}
          min="1"
          disabled={loading}
          aria-label="Quantity"
        />
        <button
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-c3 text-ink font-bold text-sm transition-colors disabled:opacity-40"
          onClick={handleIncreaseQuantity}
          disabled={loading}
          aria-label="Increase quantity"
        >+</button>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 hover:bg-red-50 rounded-xl transition-colors shrink-0 group/del"
        aria-label="Delete item"
      >
        <img src="delete.png" alt="" className="w-5 h-5 opacity-60 group-hover/del:opacity-100 transition-opacity" />
      </button>

      {error && <div className="absolute text-red-500 text-xs">{error}</div>}
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
