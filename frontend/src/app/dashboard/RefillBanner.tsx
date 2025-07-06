"use client";

import { useState } from "react";

interface RefillBannerProps {
  medicationName: string;
  daysLeft: number;
  onRefillConfirm: () => void;
  onSnooze: () => void;
}

export default function RefillBanner({ medicationName, daysLeft, onRefillConfirm, onSnooze }: RefillBannerProps) {
  const [showSnoozeConfirm, setShowSnoozeConfirm] = useState(false);

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">⚠️</strong>
      <span className="block sm:inline ml-2">
        You’ll run out of {medicationName} in {daysLeft} days.
      </span>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={onRefillConfirm}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Mark as Refilled
        </button>
        <button
          onClick={() => setShowSnoozeConfirm(true)}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
        >
          Snooze Reminder
        </button>
      </div>
      {showSnoozeConfirm && (
        <div className="mt-2 p-2 bg-yellow-200 rounded">
          <p>Reminder snoozed for 1 day.</p>
          <button
            onClick={() => setShowSnoozeConfirm(false)}
            className="mt-1 underline text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
