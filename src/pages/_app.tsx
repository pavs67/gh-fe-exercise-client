import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "~/app.scss";
import Header from "~/components/Header/Header";
import CartContextProvider from "~/context/cart-context";

// if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
// 	require('../mocks')
// }

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define the custom CSS variable for Inter font
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <div className={`${inter.className} ${inter.variable}`}>
        <Component {...pageProps} />
      </div>
    </CartContextProvider>
  );
}
