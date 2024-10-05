import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Category } from "~/types/type";

interface CategoryListProps {}

const CategoryList: FC<CategoryListProps> = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async (cont: AbortController) => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        signal: cont.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const resData: Category[] = await res.json();

      if (Array.isArray(resData)) {
        setCategories(resData.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching categories:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cont = new AbortController();

    getCategories(cont);

    return () => {
      cont.abort();
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, el: string) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      const element = document.getElementById(el);

      if (element) {
        const offset = 50;
        const pos = element.getBoundingClientRect().top;
        const top = pos + window.scrollY - offset;

        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="category-list">
      <h3>Categories</h3>

      {categories.map((category, index) => (
        <a
          key={index}
          href={`#${category.name.toLocaleLowerCase()}`}
          onClick={(e) => handleScrollTo(e, category.name.toLocaleLowerCase())}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
};

export default CategoryList;
