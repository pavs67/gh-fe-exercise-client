import "~/app.scss";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import ProductCard from "~/components/Product/ProductCard";
import Header from "~/components/Header/Header";

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
    <div className={`${inter.className} ${inter.variable}`}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}
