import Link from "next/link";
import CategoryList from "~/components/CategoryList";

export default function Home() {
  return (
    <main>
      <div className="container">
        <aside>
          <CategoryList />
        </aside>

        <section className="">
          <Link href="/products">Products</Link>
        </section>
      </div>
    </main>
  );
}
