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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/news`);
      if (!res.ok) throw new Error("Erro ao buscar notícias");

      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      </div>
    </div>
  );
};

export default News;
