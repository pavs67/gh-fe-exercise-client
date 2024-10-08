import { createContext, useCallback, useMemo, useReducer, useState } from "react";
import { cloneDeep } from "lodash";
import { CartItem, Product } from "~/types/type";

interface CartState {
  orderId: number | null;
  cartItems: CartItem[];
  cartQuantity: number;
  cartTotal: number;
  incrementItem: (product: Product) => void;
  decrementItem: (product: Product) => void;
  loading: boolean;
  createNewOrder: () => Promise<boolean>;
  clearCart: () => void;
}

const actions = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  ADD_ORDER_ID: "ADD_ORDER_ID",
  CLEAR_CART: "CLEAR_CART",
} as const;

type CartAction =
  | { type: typeof actions.ADD_ITEM; product: Product }
  | { type: typeof actions.REMOVE_ITEM; product: Product }
  | { type: typeof actions.ADD_ORDER_ID; orderId: number }
  | { type: typeof actions.CLEAR_CART };

const initialCartState: CartState = {
  orderId: null,
  cartQuantity: 0,
  cartTotal: 0,
  cartItems: [],
  incrementItem: () => {},
  decrementItem: () => {},
  clearCart: () => {},
  loading: false,
  createNewOrder: async () => false,
};

export const CartContext = createContext<CartState>(initialCartState);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case actions.ADD_ITEM: {
      const existingItemIndex = state.cartItems.findIndex((item) => item.id === action.product.id);

      const updatedItems = cloneDeep(state.cartItems);

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({ id: action.product.id, price: action.product.price, quantity: 1 });
      }

      const updatedCartQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const updatedCartTotal = updatedItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );

      return {
        ...state,
        cartItems: updatedItems,
        cartQuantity: updatedCartQuantity,
        cartTotal: updatedCartTotal,
      };
    }

    case actions.REMOVE_ITEM: {
      const existingItemIndex = state.cartItems.findIndex((item) => item.id === action.product.id);

      if (existingItemIndex >= 0) {
        const updatedItems = cloneDeep(state.cartItems);
        updatedItems[existingItemIndex].quantity -= 1;

        // remove item if 0
        const filteredItems = updatedItems.filter((item) => item.quantity > 0);

        // Recalculate cart total and quantity
        const updatedCartQuantity = filteredItems.reduce((total, item) => total + item.quantity, 0);
        const updatedCartTotal = filteredItems.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        );

        return {
          ...state,
          cartItems: filteredItems,
          cartQuantity: updatedCartQuantity,
          cartTotal: updatedCartTotal,
        };
      }

      return state;
    }

    case actions.ADD_ORDER_ID: {
      return {
        ...state,
        orderId: action.orderId,
      };
    }
    case actions.CLEAR_CART: {
      return initialCartState;
    }

    default:
      return state;
  }
};

const CartContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [loading, setLoading] = useState(false);

  const createNewOrder = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: state.cartItems.map((product) => {
            return { id: product.id, quantity: product.quantity };
          }),
        }),
      });

      if (response.ok) {
        const orderIdRes = await response.json();
        dispatch({ type: actions.ADD_ORDER_ID, orderId: orderIdRes.id });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.cartItems]);

  const value = useMemo(
    () => ({
      cartItems: state.cartItems,
      incrementItem: (product: Product) => dispatch({ type: actions.ADD_ITEM, product }),
      decrementItem: (product: Product) => dispatch({ type: actions.REMOVE_ITEM, product }),
      loading,
      orderId: state.orderId,
      cartTotal: state.cartTotal,
      cartQuantity: state.cartQuantity,
      createNewOrder,
      clearCart: () => dispatch({ type: actions.CLEAR_CART }),
    }),
    [state.cartItems, loading, state.orderId, createNewOrder, state.cartQuantity, state.cartTotal]
  );

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>;
};

export default CartContextProvider;
