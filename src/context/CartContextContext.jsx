import { createContext, useState, useContext } from "react";

// Create the CartContext
const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(20); // Set default delivery fee
  
  // Calculate the total and totalWithDelivery only once
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithDelivery = total + deliveryFee; // Include delivery fee

  // Format totals
  const formattedTotal = total.toFixed(2); // Format subtotal as $00.00
  const formattedTotalWithDelivery = totalWithDelivery.toFixed(2); // Format totalWithDelivery as $00.00
  const formattedDeliveryFee = deliveryFee.toFixed(2); // Format delivery fee as $00.00

  const addItemToCart = (item) => {
    const itemWithColors = {
      ...item,
      selectedColors: item.attributes?.color ? [item.attributes.color] : [], // Use color from attributes
    };
  
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) =>
          cartItem.id === itemWithColors.id &&
          cartItem.selectedSize === itemWithColors.selectedSize &&
          JSON.stringify(cartItem.selectedColors) === JSON.stringify(itemWithColors.selectedColors)
      );
  
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + itemWithColors.quantity }
            : cartItem
        );
      }
  
      return [...prevItems, { ...itemWithColors, quantity: itemWithColors.quantity || 1 }];
    });
  };
  
  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity in cart
  const updateQuantity = (itemId, selectedSize, selectedColors, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId &&
        item.selectedSize === selectedSize &&
        JSON.stringify(item.selectedColors) === JSON.stringify(selectedColors)
          ? { ...item, quantity: Math.max(1, parseInt(quantity, 10)) }
          : item
      )
    );
  };

  // Add item to favorites
  const addItemToFavorites = (item) => {
    setFavorites((prevItems) => {
      const alreadyFavorited = prevItems.some((favItem) => favItem.id === item.id);
      if (!alreadyFavorited) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  // Remove item from favorites
  const removeFavorite = (itemId) => {
    setFavorites((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favorites,
        addItemToCart,
        removeItem,
        updateQuantity,
        addItemToFavorites,
        removeFavorite,
        total,
        totalWithDelivery,
        deliveryFee,
        setDeliveryFee,
        formattedTotal,
        formattedTotalWithDelivery,
        formattedDeliveryFee
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCartContext = () => useContext(CartContext);
