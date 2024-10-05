import React, { FC, PropsWithChildren, useContext } from "react";
import { CartContext } from "~/context/cart-context";
import { CheckOutItems, HandleUpdateCart, Product } from "~/types/type";

interface BasketItemProps {
  product: CheckOutItems["products"][0]["product"];
  quantity: CheckOutItems["products"][0]["quantity"];
  handleUpdateCart: HandleUpdateCart;
}

// Create context
export const BasketItemContext = React.createContext<{
  product: Product;
  quantity: number;
  handleUpdateCart: HandleUpdateCart;
}>({
  product: {
    id: 0,
    name: "",
    description: "",
    image: "",
    price: 0,
    category: {
      name: "",
      order: 0,
    },
  },
  quantity: 0,
  handleUpdateCart: () => {},
});

export const useBasketItemContext = () => React.useContext(BasketItemContext);

// Define a compound component interface
interface BasketItemComponent extends FC<PropsWithChildren<BasketItemProps>> {
  Image: FC;
  Title: FC;
  Price: FC;
  UpdateQuantity: FC;
}

const BasketItem: BasketItemComponent = ({ product, quantity, handleUpdateCart, children }) => {
  return (
    <BasketItemContext.Provider value={{ product, quantity, handleUpdateCart }} key={product.id}>
      <div className={`cart-item`}>{children}</div>
    </BasketItemContext.Provider>
  );
};

const Image: FC = () => {
  const { product } = useBasketItemContext();
  return (
    <div className="cart-item__image">
      <img src={product.image} alt={product.name} />
    </div>
  );
};

const Price: FC = () => {
  const { product } = useBasketItemContext();
  return <div>£{product.price}</div>;
};

const Title: FC = () => {
  const { product } = useBasketItemContext();
  return <h3 className="cart-item__title">{product.name}</h3>;
};

const UpdateQuantity: FC = () => {
  const { product, quantity, handleUpdateCart } = useBasketItemContext();

  return (
    <div className="cart-item__btns">
      <button
        className="btn btn--small cart-item__decrease"
        onClick={() => handleUpdateCart(product, quantity - 1, "decrement")}
      >
        -
      </button>
      <div>{quantity}</div>
      <button
        className="btn btn--small cart-item__increase"
        onClick={() => handleUpdateCart(product, quantity + 1, "increment")}
      >
        +
      </button>
    </div>
  );
};

BasketItem.Image = Image;
BasketItem.Title = Title;
BasketItem.Price = Price;
BasketItem.UpdateQuantity = UpdateQuantity;

export default BasketItem;
