import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const VAPID_PUBLIC_KEY = "your_public_vapid_key_here";

export function useFCM() {
  const { token } = useAuthStore();

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      subscribeUser();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          subscribeUser();
        }
      });
    }

    async function subscribeUser() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const fcmToken = JSON.stringify(subscription);
        // Send token to backend
        await fetch("http://localhost:8000/api/users/fcm-token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token: fcmToken }),
        });
      } catch (error) {
        console.error("Failed to subscribe user to push notifications", error);
      }
    }

    function urlBase64ToUint8Array(base64String: string) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }, [token]);
}
