"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface SideEffectModalProps {
  medicationId: string;
  medicationName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const schema = yup.object().shape({
  symptom: yup.string().required("Symptom is required"),
  severity: yup
    .number()
    .min(1, "Minimum severity is 1")
    .max(10, "Maximum severity is 10")
    .required("Severity is required"),
  notes: yup.string().notRequired(),
  image: yup.mixed().notRequired(),
});

type SideEffectFormInputs = {
  symptom: string;
  severity: number;
  notes?: string;
  image?: FileList;
};

export default function SideEffectModal({ medicationId, medicationName, onClose, onSuccess }: SideEffectModalProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<SideEffectFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: SideEffectFormInputs) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("medication", medicationId);
      formData.append("symptom", data.symptom);
      formData.append("severity", data.severity.toString());
      if (data.notes) formData.append("notes", data.notes);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const res = await fetch("http://localhost:8000/api/sideeffects/side-effect-log/", {
        method: "POST",
        headers: {
          // Do not set Content-Type for multipart/form-data
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to log side effect");
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error submitting form");
    }
  };

  useEffect(() => {
    // Lock scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Log Side Effect for {medicationName}</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="symptom" className="block mb-1">
              Symptom
            </label>
            <input
              id="symptom"
              type="text"
              {...register("symptom")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.symptom && <p className="text-red-600 text-sm mt-1">{errors.symptom.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="severity" className="block mb-1">
              Severity (1-10)
            </label>
            <input
              id="severity"
              type="number"
              min={1}
              max={10}
              {...register("severity")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.severity && <p className="text-red-600 text-sm mt-1">{errors.severity.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-1">
              Photo (optional)
            </label>
            <input id="image" type="file" accept="image/*" {...register("image")} />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? "Logging..." : "Log Side Effect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
