"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface News {
  id?: string;
  title: string;
  content?: string;
  createdAt?: string;
}

const DashboardPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetchNews(token);
    }
  }, []);

  const fetchNews = async (token: string) => {
    try {
      const res = await fetch(`${apiUrl}/news/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar notícias");

      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const newNews: News = {
      title,
      content,
    };

    try {
      const res = await fetch(`${apiUrl}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNews),
      });

      if (!res.ok) throw new Error("Erro ao criar notícia");

      const createdNews = await res.json();
      setNews((prev) => [...prev, createdNews]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div>

      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Cadastro de Notícias</h1>

          {/* Formulário de Cadastro */}
          <form onSubmit={handleCreateNews} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200"
              required
            />
            <textarea
              placeholder="Conteúdo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-200"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
              Cadastrar Notícia
            </button>
          </form>

          {/* Lista de Notícias */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">Minhas Notícias Cadastradas</h2>
            {error && <p className="text-red-500">{error}</p>}
            {news.length === 0 ? (
              <p className="text-gray-500 mt-2">Nenhuma notícia cadastrada.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {news.map((item) => (
                  <li key={item.id} className="border p-4 rounded shadow bg-white">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
