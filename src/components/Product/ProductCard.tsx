import React, { PropsWithChildren, FC, useContext } from "react";
import { CartContext } from "~/context/cart-context";
import { Product } from "~/types/type";

interface ProductCardProps {
  product: Product;
  selected: boolean;
}

// Create context
export const ProductContext = React.createContext<{ product: Product; selected: boolean }>({
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
  selected: false,
});

export const useProductContext = () => React.useContext(ProductContext);

// Define a compound component interface
interface ProductCardComponent extends FC<PropsWithChildren<ProductCardProps>> {
  Image: FC;
  Title: FC;
  Description: FC;
  Price: FC;
  Category: FC;
  AddToCartBtn: FC;
}

const ProductCard: ProductCardComponent = ({ product, selected, children }) => {
  return (
    <ProductContext.Provider value={{ product, selected }} key={product.id}>
      <div className={`product-card ${selected ? "product-card--selected" : ""}`}>{children}</div>
    </ProductContext.Provider>
  );
};

const Image: FC = () => {
  const { product } = useProductContext();
  return (
    <div className="product-card__image">
      <img src={product.image} alt={product.name} />
    </div>
  );
};

const Price: FC = () => {
  const { product } = useProductContext();
  return <p>£{product.price}</p>;
};

const Title: FC = () => {
  const { product } = useProductContext();
  return <h3 className="product-card__title">{product.name}</h3>;
};

const Description: FC = () => {
  const { product } = useProductContext();
  return <p>{product.description}</p>;
};

const Category: FC = () => {
  const { product } = useProductContext();
  return <p>{product.category.name}</p>;
};

const AddToCartBtn: FC = () => {
  const { product } = useProductContext();
  const { cartItems, incrementItem, decrementItem, loading } = useContext(CartContext);

  const found = cartItems.find((i) => i.id === product.id);

  if (found) {
    return (
      <div className="product-card__btns">
        <button
          disabled={loading}
          className="product-card__decrease"
          onClick={() => decrementItem(product)}
        >
          -
        </button>
        <div>{found.quantity}</div>
        <button
          disabled={loading}
          className="btn product-card__increase"
          onClick={() => incrementItem(product)}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="product-card__btns">
      <button
        disabled={loading}
        className="btn product-card__btn-add-to-basket"
        onClick={() => incrementItem(product)}
      >
        Add to basket
      </button>
    </div>
  );
};

ProductCard.Image = Image;
ProductCard.Title = Title;
ProductCard.Description = Description;
ProductCard.Price = Price;
ProductCard.Category = Category;
ProductCard.AddToCartBtn = AddToCartBtn;

export default ProductCard;
