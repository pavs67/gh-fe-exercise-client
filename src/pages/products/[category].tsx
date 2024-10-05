import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import CategoryList from "~/components/CategoryList";
import ProductCard from "~/components/Product/ProductCard";
import { Product } from "~/types/type";

interface ProductListProps {
  products: Product[];
  error: boolean;
  category: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let products: Product[] = [];
  let error = false;

  try {
    const res = await fetch(`${process.env.API_URL}/products?norandom`);
    const resData = await res.json();

    if (Array.isArray(resData)) {
      products = resData.filter((i) => i.category.name.toLowerCase() === params?.category);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error = true;
  }

  return {
    props: {
      products,
      error,
      category: params?.category,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.API_URL}/products?norandom`);
  const products = await res.json();

  const paths = products.map((product: Product) => ({
    params: { category: product.category.name },
  }));

  return {
    paths,
    fallback: true,
  };
};

export default function Page({ products, error, category }: ProductListProps) {
  const router = useRouter();

  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }

  return (
    <div className="container">
      <aside>
        <CategoryList />
      </aside>

      <div className="">
        {router.isFallback ? (
          <div>Loading</div>
        ) : (
          <>
            <h1>{category}</h1>
            <div className="product-list">
              {products.map((product) => (
                <ProductCard product={product} key={product.id}>
                  <ProductCard.Image />
                  <ProductCard.Title />

                  <ProductCard.Price />
                  <ProductCard.Category />
                </ProductCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
