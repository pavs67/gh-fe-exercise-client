import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import BasketItem from "~/components/Checkout/BasketItem";
import { CartContext } from "~/context/cart-context";
import { CheckOutItems, Product } from "~/types/type";

interface CartProps {}

export default function Page({}: CartProps) {
  const [data, setData] = useState<CheckOutItems | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const { incrementItem, decrementItem, loading, orderId } = useContext(CartContext);

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

  if (orderId === null) {
    return (
      <div className="container">
        Your basket is empty <Link href="/products">View products</Link>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>There was an error loading your cart please try again</p>;
  if (!data) return <p>No data</p>;

  if (checkoutComplete) {
    return <p>Complete</p>;
  }

  return (
    <section className="cart">
      <div className="container">
        <h1 className="cart__title">Your basket</h1>

        <div className="cart__inner">
          <div className="cart-list">
            {data.products
              .filter((i) => i.quantity > 0)
              .map((product) => (
                <BasketItem
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
            £{totalCost}
            <button onClick={handleCheckout}>Secure Checkout</button>
          </div>
        </div>
      </div>
    </section>
  );
}
