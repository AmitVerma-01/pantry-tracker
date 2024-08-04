import { useCallback, useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import AddItem from "./AddItem";
import ItemComponent from "./ItemComponent";
import Recipe from "./Recipe";

const Item = () => {
  const firebase = useFirebase();
  const [itemList, setItemList] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isRecipeReady, setIsRecipeReady] = useState(false)
  const [recipe , setRecipe] = useState('')


  const fetchData = useCallback(async () => {
    const data = await firebase.getItems();
    setItemList(data);
  }, [firebase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddItem = async (itemName, quantity) => {
    await firebase.addItem(itemName, quantity);
    fetchData();
  };

  const handleIncreaseQuantity = async (docId) => {
    await firebase.increaseQuantity(docId);
    fetchData();
  };

  const handleDecreaseQuantity = async (docId) => {
    await firebase.decreaseQuantity(docId);
    fetchData();
  };

  const handleUpdateItemQuantity = async (docId, quantity) => {
    await firebase.updateItemQuantity(docId, quantity);
    fetchData();
  };

  const handleRemoveItem = async (docId)=>{
    await firebase.removeItem(docId)
    fetchData()
  } 

  const handleCheckboxChange = (itemName, checked) => {
    setCheckedItems((prev) => {
      if (checked) {
        return [...prev, itemName];
      } else {
        return prev.filter((name) => name !== itemName);
      }
    });
  };

  const handleGetRecipe = async () => {
    // Replace this with the actual logic to call your ML 
    setIsRecipeReady(true)
    try {
      const responde = await firebase.fetchRecipeFromModel(checkedItems)
      const rec = responde.slice(7,-3)
      setRecipe(rec)
    } catch (error) {
      console.log(error.message);
      
      setIsRecipeReady(false)
    }
    setIsRecipeReady(false)
    // console.log("Checked items for recipe:", checkedItems);
    // Example: await fetchRecipeFromModel(checkedItems);
  };

  return (
    <div className="flex w-screen md:p-0">
      <Recipe recipe={recipe}/>
      <div className="w-screen md:3/5 p-3">
        <AddItem addItem={handleAddItem} />
        <div className="border border-c4 flex w-full rounded-lg h-14 md:text-base items-center text-sm mb-2">
          <div className="border-r border-c4 w-3/5 text-center p-2">
            Item Name
          </div>
          <div className="border-r border-c4 w-1/5 text-center p-2">
            Quantity
          </div>
          <div className="w-1/5 text-center p-2">Actions</div>
        </div>
        {itemList.map((item) => (
          <ItemComponent
            key={item.id}
            docId={item.id}
            itemName={item.itemName}
            quantity={item.quantity}
            increaseQuantity={handleIncreaseQuantity}
            decreaseQuantity={handleDecreaseQuantity}
            updateItemQuantity={handleUpdateItemQuantity}
            removeitem={handleRemoveItem}
            onCheckboxChange={handleCheckboxChange}
          />
        ))}
      </div>
      <button className="bg-c4 p-1 px-2 hover:bg-c3 fixed bottom-2 rounded-lg shadow-lg right-2" onClick={handleGetRecipe}>
        {isRecipeReady ? "Loading...":"Get Recipe"}
      </button>
    </div>
  );
};

export default Item;
