import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import CategoryList from "~/components/CategoryList";
import Header from "~/components/Header/Header";
import ProductCard from "~/components/Product/ProductCard";
import { CartContext } from "~/context/cart-context";
import { GroupedProducts, groupSortProducts } from "~/helpers/groupSortProducts";
import { Product } from "~/types/type";

interface ProductListProps {
  products: Product[];
  error: boolean;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let products: Product[] = [];
  let error = false;

  try {
    const res = await fetch(`${process.env.API_URL}/products?norandom`);
    const resData = await res.json();

    if (Array.isArray(resData)) {
      products = resData;
    }
  } catch (err) {
    error = true;
  }

  return {
    props: {
      products,
      error,
    },
    revalidate: 10,
  };
};

export default function Page({ products, error }: ProductListProps) {
  const router = useRouter();
  const { cartItems, cartQuantity, createNewOrder, loading } = useContext(CartContext);
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);
  const [addToCartError, setAddToCartError] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      setGroupedProducts(groupSortProducts(products));
    }
  }, [products]);

  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }

  const handleViewBasket = async () => {
    setAddToCartError(false);

    const success = await createNewOrder();

    if (success) {
      router.push(`/cart`);
    } else {
      setAddToCartError(true);
      // error
    }
  };

  return (
    <>
      <Header />

      <div className="container">
        <h1>Products</h1>
        <div className="product-page">
          <aside className="product-page__sidebar">
            <CategoryList />
          </aside>

          <div className="product-page__products">
            {router.isFallback ? (
              <div>Loading</div>
            ) : (
              <>
                {groupedProducts.map((group) => (
                  <div
                    className="product-list-group"
                    id={group.category.toLowerCase()}
                    key={group.category}
                  >
                    <h2>
                      {group.category} ({group.products.length})
                    </h2>

                    <div className="product-list">
                      {group.products.map((product) => (
                        <ProductCard
                          product={product}
                          key={product.id}
                          selected={cartItems.findIndex((i) => i.id === product.id) >= 0}
                        >
                          <ProductCard.Image />
                          <ProductCard.Title />
                          <ProductCard.Price />
                          <ProductCard.AddToCartBtn />
                        </ProductCard>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cartQuantity > 0 && (
            <div className="product-page__basket">
              <div className="container">
                <div className="product-page__basket-inner">
                  <div>{cartQuantity} items added to basket.</div>
                  <div className="">
                    {addToCartError && <span>There was an error, please try again.</span>}

                    <button className="btn" onClick={handleViewBasket} disabled={loading}>
                      View basket {loading && "Loading"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
