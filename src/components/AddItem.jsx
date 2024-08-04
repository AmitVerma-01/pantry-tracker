import { useState } from "react";

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const submitItem = async () => {
    await addItem(itemName, quantity);
    setItemName("");
    setQuantity("");
  };

  return (
    <div className="py-2 w-full">
      <h2 className="text-2xl font-semibold md:font-bold my-1">Add New Item</h2>
      <div className="flex gap-x-3">
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="bg-c1 shadow-md rounded-lg p-2 w-3/5 outline-c3 text-lg"
          placeholder="Item Name..."
        />
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="bg-c1 shadow-md w-2/5 rounded-lg p-2 outline-c3 text-lg"
          placeholder="Quantity"
        />
      </div>
      <div className="w-full flex justify-end">
        <button
          className="bg-c4 p-2 rounded-lg shadow-lg mt-2 hover:bg-c3"
          onClick={submitItem}
        >
          Add Item
        </button>
      </div>
    </div>
  );
};

export default AddItem;
