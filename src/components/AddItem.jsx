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
    const itemNameError = validateItemName(itemName);
    const quantityError = validateQuantity(quantity);

    setErrors({
      itemName: itemNameError,
      quantity: quantityError
    });

    return !itemNameError && !quantityError;
  };

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    
    // Real-time validation
    if (errors.itemName) {
      setErrors(prev => ({
        ...prev,
        itemName: validateItemName(value)
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
        quantity: validateQuantity(value)
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
    <div className="py-3 w-full">
      <h2 className="text-2xl md:text-3xl font-semibold md:font-bold my-2 text-gray-800">Add New Item</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-3/5">
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={handleItemNameChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className={`bg-white shadow-md rounded-lg p-3 w-full border-2 text-lg transition-smooth hover:shadow-lg focus:shadow-lg ${
                errors.itemName ? 'border-red-500 focus:border-red-500' : 'border-c3 focus:border-c4'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Item Name..."
              aria-label="Item name"
              aria-invalid={!!errors.itemName}
              aria-describedby={errors.itemName ? "itemName-error" : undefined}
            />
            {errors.itemName && (
              <p id="itemName-error" className="text-red-500 text-sm mt-1 animate-slide-down">
                {errors.itemName}
              </p>
            )}
          </div>
          <div className="w-full sm:w-2/5">
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              min="1"
              className={`bg-white shadow-md w-full rounded-lg p-3 border-2 text-lg transition-smooth hover:shadow-lg focus:shadow-lg ${
                errors.quantity ? 'border-red-500 focus:border-red-500' : 'border-c3 focus:border-c4'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Quantity"
              aria-label="Quantity"
              aria-invalid={!!errors.quantity}
              aria-describedby={errors.quantity ? "quantity-error" : undefined}
            />
            {errors.quantity && (
              <p id="quantity-error" className="text-red-500 text-sm mt-1 animate-slide-down">
                {errors.quantity}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button
            className={`bg-c4 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-smooth hover-lift active:scale-95 flex items-center gap-2 font-semibold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={submitItem}
            disabled={isLoading}
            aria-label="Add item"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </>
            )}
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
