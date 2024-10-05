import { Product } from "~/types/type";

export interface GroupedProducts {
  category: string;
  products: Product[];
}

export const groupSortProducts = (products: Product[]) => {
  const grouped = products.reduce((acc: GroupedProducts[], product) => {
    const category = product.category.name;
    const foundCategory = acc.find((g) => g.category === category);

    if (foundCategory) {
      foundCategory.products.push(product);
    } else {
      acc.push({ category, products: [product] });
    }

    return acc;
  }, []);
  console.log("🚀 ~ grouped ~ grouped:", grouped);

  grouped.forEach((group) => {
    group.products.sort((a, b) => a.name.localeCompare(b.name));
  });

  grouped.sort((a, b) => a.category.localeCompare(b.category));

  return grouped;
};
