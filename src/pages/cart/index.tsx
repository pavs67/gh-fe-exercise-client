import Link from "next/link";
import React from "react";
import { useContext, useEffect, useState } from "react";
import BasketItem from "~/components/Checkout/BasketItem";
import Header from "~/components/Header/Header";
import { CartContext } from "~/context/cart-context";
import { CheckOutItems, Product } from "~/types/type";

interface CartProps {}

export default function Page({}: CartProps) {
  const [data, setData] = useState<CheckOutItems | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const { incrementItem, decrementItem, loading, orderId, clearCart } = useContext(CartContext);

  const getCheckoutItems = async (orderId: number) => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
      const resData: CheckOutItems = await res.json();

      if (resData.id !== undefined) {
        setData(resData);
      }
    } catch (error) {
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = async (
    product: Product,
    quantity: number,
    type: "increment" | "decrement"
  ) => {
    if (orderId) {
      setLoading(true);

      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update_quantity",
            productId: product.id,
            quantity,
          }),
        });

        getCheckoutItems(orderId);

        type === "increment" ? incrementItem(product) : decrementItem(product);
      } catch (error) {
        setError(true);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (orderId) {
      getCheckoutItems(orderId);
    }
  }, [orderId]);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        setCheckoutComplete(true);
        clearCart();
      } else {
        setCheckoutComplete(false);
      }
    } catch (error) {
      setError(true);
      setCheckoutComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = data?.products.reduce(
    (total, product) => total + product.quantity * product.product.price,
    0
  );

  if (error) return <p>There was an error loading your cart please try again</p>;

  return (
    <>
      <Header reduced={true} />

      <section className="cart">
        <div className="container">
          {!checkoutComplete && (orderId === null || data === null) && (
            <>
              <p>
                Your basket is empty <Link href="/">View products</Link>
              </p>
            </>
          )}

          {checkoutComplete && (
            <>
              <h1>Success</h1>
              <p>You&apos;re all done!</p>
            </>
          )}

          {!checkoutComplete && data && (
            <>
              <h1 className="cart__title">Your basket</h1>

              {isLoading && <div>Loading</div>}

              <div className="cart__inner">
                <div className="cart-list">
                  {data.products
                    .filter((i) => i.quantity > 0)
                    .map((product, index) => (
                      <BasketItem
                        key={index}
                        product={product.product}
                        quantity={product.quantity}
                        handleUpdateCart={handleUpdateCart}
                      >
                        <BasketItem.Image />
                        <BasketItem.Title />
                        <BasketItem.Price />
                        <BasketItem.UpdateQuantity />
                      </BasketItem>
                    ))}
                </div>

                <div className="cart-totals">
                  <h3 className="cart-totals__title">Total</h3>
                  <div className="cart-totals__price">£{totalCost}</div>

                  <button className="btn cart-totals__btn" onClick={handleCheckout}>
                    Secure Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
