import { Product } from "~/types/type";
import { groupSortProducts } from "./groupSortProducts";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Apple",
    description: "A juicy red apple",
    image: "apple.jpg",
    price: 1.2,
    category: { name: "Fruits", order: 1 },
  },
  {
    id: 2,
    name: "Banana",
    description: "A ripe banana",
    image: "banana.jpg",
    price: 0.8,
    category: { name: "Fruits", order: 1 },
  },
  {
    id: 3,
    name: "Broccoli",
    description: "Fresh broccoli",
    image: "broccoli.jpg",
    price: 2.5,
    category: { name: "Vegetables", order: 2 },
  },
  {
    id: 4,
    name: "Carrot",
    description: "Crunchy carrots",
    image: "carrot.jpg",
    price: 1.0,
    category: { name: "Vegetables", order: 2 },
  },
];

describe("groupSortProducts", () => {
  it("should group and sort products by category and name", () => {
    const grouped = groupSortProducts(mockProducts);

    expect(grouped).toHaveLength(2);
    expect(grouped[0].category).toBe("Fruits");
    expect(grouped[0].products).toHaveLength(2);
    expect(grouped[0].products[0].name).toBe("Apple");
    expect(grouped[0].products[1].name).toBe("Banana");

    expect(grouped[1].category).toBe("Vegetables");
    expect(grouped[1].products).toHaveLength(2);
    expect(grouped[1].products[0].name).toBe("Broccoli");
    expect(grouped[1].products[1].name).toBe("Carrot");
  });

  it("should return an empty array when no products are provided", () => {
    const grouped = groupSortProducts([]);
    expect(grouped).toEqual([]);
  });

  it("should handle products belonging to the same category", () => {
    const singleCategoryProducts: Product[] = [
      {
        id: 5,
        name: "Orange",
        description: "Juicy orange",
        image: "orange.jpg",
        price: 1.5,
        category: { name: "Fruits", order: 1 },
      },
      {
        id: 6,
        name: "Grape",
        description: "Sweet grapes",
        image: "grape.jpg",
        price: 2.0,
        category: { name: "Fruits", order: 1 },
      },
    ];

    const grouped = groupSortProducts(singleCategoryProducts);

    expect(grouped).toHaveLength(1);
    expect(grouped[0].category).toBe("Fruits");
    expect(grouped[0].products).toHaveLength(2);
    expect(grouped[0].products[0].name).toBe("Grape");
    expect(grouped[0].products[1].name).toBe("Orange");
  });
});
