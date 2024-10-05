import Link from "next/link";
import { FC } from "react";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <Link href="/">Logo</Link>

          <div className="header__cart"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
