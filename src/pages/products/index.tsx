import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CategoryList from "~/components/CategoryList";
import ProductCard from "~/components/Product/ProductCard";
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
    console.error("Error fetching products:", err);
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
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setGroupedProducts(groupSortProducts(products));
    }
  }, [products]);

  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }

  return (
    <div className="container">
      <div className="product-page">
        <aside>
          <CategoryList />
        </aside>

        <div className="">
          {router.isFallback ? (
            <div>Loading</div>
          ) : (
            <>
              {groupedProducts.map((group) => (
                <div className="product-list-group" key={group.category}>
                  <h2>
                    {group.category} ({group.products.length})
                  </h2>
                  <div className="product-list">
                    {group.products.map((product) => (
                      <ProductCard product={product} key={product.id}>
                        <ProductCard.Image />
                        <ProductCard.Title />

                        <ProductCard.Price />
                      </ProductCard>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
