import Link from "next/link";
import React, { useContext } from "react";
import { FC } from "react";
import { CartContext } from "~/context/cart-context";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { cartItems, cartTotal, cartQuantity } = useContext(CartContext);
  console.log("🚀 ~ cartItems:", cartItems);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <Link href="/">
              Cosmetic Company Logo
              {/* <img src="cosmetic-logo.png" alt="Cosmetic logo" width={100} /> */}
            </Link>

            {cartQuantity > 0 && (
              <div className="header__cart">
                £{cartTotal} ({cartQuantity})
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;
