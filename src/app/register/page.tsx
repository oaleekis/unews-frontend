"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`${API_URL}/authors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao registrar usuário");
            }


            router.push("/login");
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl mb-4">Registro</h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-2 w-80">
                <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" required />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-green-500 text-white p-2 rounded">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
