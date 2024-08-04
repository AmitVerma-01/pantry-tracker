import { useState } from "react";

const ItemComponent = ({
    docId,
    itemName,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    updateItemQuantity,
    removeitem,
    onCheckboxChange
  }) => {
    const handleUpdateItemQuantity = async (e) => {
      await updateItemQuantity(docId, e.target.value);
    };
  
    const handleCheckboxChange = (e) => {
      onCheckboxChange(itemName, e.target.checked);
    };
    return (
      <div className="w-full border mt-1 flex items-center justify-between border-c2 rounded-lg h-10">
        <div className="flex items-center pl-2 w-3/5">
          <input type="checkbox"  onChange={handleCheckboxChange}/>
          <p className="text-center w-10/12">{itemName}</p>
        </div>
        <div className="w-1/5 flex justify-center items-center">
          <button className="w-1/4 pb-1" onClick={() => decreaseQuantity(docId)}>
            -
          </button>
          <input
            type="number"
            onChange={handleUpdateItemQuantity}
            className="w-2/5 rounded-lg text-center bg-c1/50 shadow-md"
            value={quantity}
          />
          <button className="w-1/4 pb-1" onClick={() => increaseQuantity(docId)}>
            +
          </button>
        </div>
        <div className="w-1/5 flex justify-center items-center">
          <button onClick={() => removeitem(docId)}>
            <img src="delete.png" alt="delete" />
          </button>
        </div>
      </div>
    );
  };
  
  export default ItemComponent;
  