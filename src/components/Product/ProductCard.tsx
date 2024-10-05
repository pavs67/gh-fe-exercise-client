import React, { PropsWithChildren, FC } from "react";
import { Product } from "~/types/type";

interface ProductCardProps {
  product: Product;
}

// Create context
export const ProductContext = React.createContext<Product>({
  id: 0,
  name: "",
  description: "",
  image: "",
  price: 0,
  category: {
    name: "",
    order: 0,
  },
});

export const useProductContext = () => React.useContext(ProductContext);

interface ProductCardComponent extends FC<PropsWithChildren<ProductCardProps>> {
  Image: typeof Image;
  Title: typeof Title;
  Description: typeof Description;
  Price: typeof Price;
  Category: typeof Category;
  AddToCartBtn: typeof AddToCartBtn;
}

const ProductCard: ProductCardComponent = ({ product, children }) => {
  return (
    <ProductContext.Provider value={product} key={product.id}>
      <div className="product-card">{children}</div>
    </ProductContext.Provider>
  );
};

const Image: FC = () => {
  const product = useProductContext();
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={product.image} alt={product.name} />;
};

const Price: FC = () => {
  const product = useProductContext();
  return <p>£{product.price}</p>;
};

const Title: FC = () => {
  const product = useProductContext();
  return <h1>{product.name}</h1>;
};

const Description: FC = () => {
  const product = useProductContext();
  return <p>{product.description}</p>;
};

const Category: FC = () => {
  const product = useProductContext();
  return <p>{product.category.name}</p>;
};

const AddToCartBtn: FC = () => {
  const product = useProductContext();
  return <button className="btn">Add to cart</button>;
};

ProductCard.Image = Image;
ProductCard.Title = Title;
ProductCard.Description = Description;
ProductCard.Price = Price;
ProductCard.Category = Category;
ProductCard.AddToCartBtn = AddToCartBtn;

export default ProductCard;
