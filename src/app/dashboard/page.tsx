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
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchNews(token);
    }
  }, []);

  const fetchNews = async (token: string, pageNum = 1) => {
    try {
      const res = await fetch(`${apiUrl}/news/me?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar notícias");
  
      const { data, totalPages } = await res.json();
      setNews(data);
      setTotalPages(totalPages);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchNews(localStorage.getItem("token") || "", newPage);
    }
  };

  const handleCreateOrUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const newsData: News = { title, content };

    try {
      let res;
      if (editingNews) {
        res = await fetch(`${apiUrl}/news/${editingNews.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newsData),
        });
      } else {
        res = await fetch(`${apiUrl}/news`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newsData),
        });
      }

      if (!res.ok) throw new Error("Erro ao salvar notícia");
      const savedNews = await res.json();
      setNews((prev) =>
        editingNews ? prev.map((n) => (n.id === savedNews.id ? savedNews : n)) : [...prev, savedNews]
      );
      setTitle("");
      setContent("");
      setEditingNews(null);
      fetchNews(token, 1); 
      setPage(1);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteNews = async (id?: string) => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await fetch(`${apiUrl}/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro ao excluir notícia");
      setNews((prev) => prev.filter((item) => item.id !== id));
      fetchNews(token, 1); 
      setPage(1);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEditNews = (newsItem: News) => {
    setTitle(newsItem.title);
    setContent(newsItem.content || "");
    setEditingNews(newsItem);
    fetchNews(localStorage.getItem("token") || "", page);
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{editingNews ? "Editar Notícia" : "Cadastro de Notícias"}</h1>
          <form onSubmit={handleCreateOrUpdateNews} className="flex flex-col gap-4">
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
              {editingNews ? "Atualizar Notícia" : "Cadastrar Notícia"}
            </button>
          </form>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">Minhas Notícias Cadastradas</h2>
            {error && <p className="text-red-500">{error}</p>}
            {news.length === 0 ? (
              <p className="text-gray-500 mt-2">Nenhuma notícia cadastrada.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {news.map((item) => (
                  <li key={item.id} className="border p-4 rounded shadow bg-white flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNews(item)}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-gray-300 p-2 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="p-2">{page} de {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-gray-300 p-2 rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
