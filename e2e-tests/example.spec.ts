import { test, expect } from "@playwright/test";

test("should add product to basket, navigate to cart, and proceed to checkout successfully", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/");

  await page.locator(".product-card__btn-add-to-basket").first().click();

  await page.getByRole("button", { name: "View basket" }).click();

  await expect(page).toHaveURL("http://localhost:3000/cart", { timeout: 2000 });

  await page.getByRole("button", { name: "Secure Checkout" }).click();

  await expect(page.getByRole("heading", { name: "Success" })).toBeVisible();
});
