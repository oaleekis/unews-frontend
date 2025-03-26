"use client";

import { useEffect, useState } from "react";
import styles from "./news.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NewsItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const fetchNews = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/news?page=${pageNum}&limit=5`);
      if (!res.ok) throw new Error("Erro ao buscar notícias");

      const { data, totalPages } = await res.json();
      setNews(data);
      setTotalPages(totalPages); // Atualiza o total de páginas
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className={styles.section}>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Últimas Notícias</h1>

        {news.length === 0 && !loading && <p>Nenhuma notícia encontrada.</p>}

        <ul className="space-y-4">
          {news.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
              <span className="text-sm text-gray-500">
                Publicado em {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>

        {loading && <p className="text-center mt-4">Carregando...</p>}

        {/* Paginação */}
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-300 p-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="p-2">
            Página {page} de {totalPages}
          </span>
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
  );
};

export default News;
