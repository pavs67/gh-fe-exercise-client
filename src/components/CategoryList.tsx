import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Category } from "~/types/type";

interface CategoryListProps {}

const CategoryList: FC<CategoryListProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const resData = await res.json();

      if (Array.isArray(resData)) {
        setCategories(resData);
      }
    } catch (error) {
      console.log(error);
      error = true;
    }
  };

  useEffect(() => {
    getCategories();

    return () => {};
  }, []);

  return (
    <div className="category-list">
      {categories.map((category, index) => (
        <Link key={index} href={`/products/${category.name.toLocaleLowerCase()}`}>
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
