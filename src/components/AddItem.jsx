import { useState } from "react";
import PropTypes from "prop-types";
import { useToast } from "./common/Toast";
import { validateItemName, validateQuantity } from "../utils/validation";
import { callbackProp } from "../types/propTypes";

const AddItem = ({ onAddItem, loading: externalLoading }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ itemName: "", quantity: "" });
  const toast = useToast();

  const validateForm = () => {
    const itemNameResult = validateItemName(itemName);
    const quantityResult = validateQuantity(quantity);

    setErrors({
      itemName: itemNameResult.error || "",
      quantity: quantityResult.error || ""
    });

    return itemNameResult.isValid && quantityResult.isValid;
  };

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    
    // Real-time validation
    if (errors.itemName) {
      setErrors(prev => ({
        ...prev,
        itemName: validateItemName(value).error || ""
      }));
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
    
    // Real-time validation
    if (errors.quantity) {
      setErrors(prev => ({
        ...prev,
        quantity: validateQuantity(value).error || ""
      }));
    }
  };

  const submitItem = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onAddItem(itemName.trim(), parseInt(quantity, 10));
      toast.success(`${itemName} added successfully!`);
      setItemName("");
      setQuantity("");
      setErrors({ itemName: "", quantity: "" });
    } catch (error) {
      toast.error(error.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitItem();
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <div className="card p-5 md:p-6 mb-5 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-c2 text-lg">➕</span>
        <div>
          <h2 className="section-title !text-xl">Add item</h2>
          <p className="section-subtitle">Quickly stock your pantry</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:flex-[3]">
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={handleItemNameChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className={`input-field ${errors.itemName ? '!border-red-400' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g. Olive oil, Rice, Tomatoes..."
              aria-label="Item name"
              aria-invalid={!!errors.itemName}
              aria-describedby={errors.itemName ? "itemName-error" : undefined}
            />
            {errors.itemName && (
              <p id="itemName-error" className="text-red-500 text-sm mt-1.5 animate-slide-down">
                {errors.itemName}
              </p>
            )}
          </div>
          <div className="w-full sm:flex-[2]">
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              min="1"
              className={`input-field ${errors.quantity ? '!border-red-400' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Qty"
              aria-label="Quantity"
              aria-invalid={!!errors.quantity}
              aria-describedby={errors.quantity ? "quantity-error" : undefined}
            />
            {errors.quantity && (
              <p id="quantity-error" className="text-red-500 text-sm mt-1.5 animate-slide-down">
                {errors.quantity}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="btn-primary"
            onClick={submitItem}
            disabled={isLoading}
            aria-label="Add item"
          >
            {isLoading ? 'Adding...' : '+ Add to pantry'}
          </button>
        </div>
      </div>
    </div>
  );
};

AddItem.propTypes = {
  onAddItem: callbackProp.isRequired,
  loading: PropTypes.bool
};

AddItem.defaultProps = {
  loading: false
};

export default AddItem;
