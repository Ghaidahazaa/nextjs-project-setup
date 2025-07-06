"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocaleStore } from "../store/useLocaleStore";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "next-i18next";
import { appWithTranslation } from "next-i18next";

export default function SplashScreen() {
  const router = useRouter();
  const { lang, setLang, isRTL } = useLocaleStore();
  const { token } = useAuthStore();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    // Simulate initialization delay
    setTimeout(() => {
      setLoading(false);
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 2000);
  }, [token, router]);

  const toggleLanguage = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black transition-all duration-500">
      <div className="mb-8">
        <img src="/wateen-logo.svg" alt="Wateen Logo" className="w-32 h-32 animate-scale-in" />
      </div>
      {loading ? (
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4"></div>
      ) : null}
      <button
        onClick={toggleLanguage}
        className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition"
        aria-label="Toggle Language"
      >
        {lang === "en" ? "العربية 🇸🇦" : "English 🇺🇸"}
      </button>
      <style jsx>{`
        .loader {
          border-top-color: #000;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease forwards;
        }
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
