"use client";

import { useAuthStore } from "../../store/useAuthStore";
import { useLocaleStore } from "../../store/useLocaleStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import RefillBanner from "./RefillBanner";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { lang, setLang, isRTL } = useLocaleStore();
  const router = useRouter();
  const [medications, setMedications] = useState<any[]>([]);
  const [refillAlert, setRefillAlert] = useState<{ medicationName: string; daysLeft: number } | null>(null);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  useEffect(() => {
    // Fetch medications from backend (placeholder)
    // For now, empty list to show placeholder
    setMedications([]);

    // Simulate refill alert check
    // In real app, fetch from backend or calculate here
    setRefillAlert({
      medicationName: "Metformin",
      daysLeft: 3,
    });
  }, []);

  const toggleLanguage = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const handleAddMedication = () => {
    router.push("/medication/add");
  };

  const handleRefillConfirm = async () => {
    if (!refillAlert) return;
    try {
      const res = await fetch("http://localhost:8000/api/reminders/refill-log/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          medication_id: "abc123", // Replace with real med id
          date: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to confirm refill");
      }
      setRefillAlert(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSnooze = () => {
    // Implement snooze logic, e.g., hide banner for a day
    setRefillAlert(null);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">
          {lang === "en" ? `Good morning, ${user?.username || "User"}` : `صباح الخير، ${user?.username || "المستخدم"}`}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition"
            aria-label="Toggle Language"
          >
            {lang === "en" ? "العربية 🇸🇦" : "English 🇺🇸"}
          </button>
          <button
            onClick={logout}
            className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
            aria-label="Logout"
          >
            {lang === "en" ? "Logout" : "تسجيل الخروج"}
          </button>
        </div>
      </header>
      {refillAlert && (
        <RefillBanner
          medicationName={refillAlert.medicationName}
          daysLeft={refillAlert.daysLeft}
          onRefillConfirm={handleRefillConfirm}
          onSnooze={handleSnooze}
        />
      )}
      <main className="flex-grow flex flex-col items-center justify-center">
        {medications.length === 0 ? (
          <div className="max-w-md w-full border border-gray-300 rounded p-6 text-center">
            <p className="mb-4 text-lg">
              {lang === "en" ? "You have no medications yet." : "ليس لديك أدوية حتى الآن."}
            </p>
            <button
              onClick={handleAddMedication}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              {lang === "en" ? "+ Add Medication" : "+ أضف دواء"}
            </button>
          </div>
        ) : (
          <div>
            {/* Medication list will go here */}
          </div>
        )}
      </main>
    </div>
  );
}
