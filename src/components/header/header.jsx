"use client";

import { useState, useEffect } from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  useEffect(() => {
    const handleBackButton = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <a href="/">uNews</a>
        </div>

        {/* Botão do menu hamburguer */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <div className={styles.buttonContainer}>
          {isLoggedIn ? (
            <>
              <a className={styles.button} href="/dashboard">
                <FontAwesomeIcon icon={faGreaterThan} className={styles.button_icon} />
                Cadastrar Notícia
              </a>
              <a className={styles.buttonExit} onClick={handleLogout}>
                Sair
              </a>
            </>
          ) : (
            <>
              <a className={styles.button} onClick={handleLoginRedirect}>
                Login
              </a>
              <a className={styles.button} onClick={handleRegisterRedirect}>
                Register
              </a>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul>
            {isLoggedIn ? (
              <li>
                <a
                  className={styles.button}
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faGreaterThan} className={styles.button_icon} />
                  Cadastrar Notícia
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a
                    className={styles.button}
                    onClick={() => {
                      setMenuOpen(false);
                      handleLoginRedirect();
                    }}
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    className={styles.button}
                    onClick={() => {
                      setMenuOpen(false);
                      handleRegisterRedirect();
                    }}
                  >
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
