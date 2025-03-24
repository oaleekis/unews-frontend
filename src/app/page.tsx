import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import News from "./news/news";


export default function Home() {
  return (
    <main>
      <Header  />
      <News />
      <Footer />
    </main>
  );
}