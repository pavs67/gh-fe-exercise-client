import Link from "next/link";
import React, { useContext } from "react";
import { FC } from "react";
import { CartContext } from "~/context/cart-context";

interface HeaderProps {
  reduced?: boolean;
}

const Header: FC<HeaderProps> = ({ reduced }) => {
  const { cartItems, cartTotal, cartQuantity } = useContext(CartContext);
  console.log("🚀 ~ cartItems:", cartItems);

  return (
    <>
      <header className={`header ${reduced ? "header--reduced" : ""}`}>
        <div className="container">
          <div className="header__inner">
            <Link href="/">
              <img src="cosm-logo.png" alt="Cosm logo" width={100} />
            </Link>

            {!reduced && cartQuantity > 0 && (
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
