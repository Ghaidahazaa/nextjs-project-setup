"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

const schema = yup.object().shape({
  dob: yup.date().required("Date of Birth is required"),
  gender: yup.string().oneOf(["male", "female", "other"]).required("Gender is required"),
  chronicConditions: yup.array().of(yup.string()),
  healthGoals: yup.array().of(yup.string()),
});

type OnboardingFormInputs = {
  dob: string;
  gender: string;
  chronicConditions: string[];
  healthGoals: string[];
};

const chronicConditionsOptions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Other",
];

const healthGoalsOptions = [
  "No missed doses",
  "Log blood pressure daily",
  "Maintain healthy diet",
  "Exercise regularly",
];

export default function OnboardingPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OnboardingFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      chronicConditions: [],
      healthGoals: [],
    },
  });

  const onSubmit = async (data: OnboardingFormInputs) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/users/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dob: data.dob,
          gender: data.gender,
          chronic_conditions: data.chronicConditions,
          goals: data.healthGoals,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Onboarding</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="dob" className="block mb-1">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            {...register("dob")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Gender</label>
          <select
            {...register("gender")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Chronic Conditions</label>
          <div className="flex flex-wrap gap-2">
            {chronicConditionsOptions.map((condition) => (
              <label key={condition} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={condition}
                  {...register("chronicConditions")}
                  className="form-checkbox"
                />
                <span>{condition}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Health Goals</label>
          <div className="flex flex-wrap gap-2">
            {healthGoalsOptions.map((goal) => (
              <label key={goal} className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={goal}
                  {...register("healthGoals")}
                  className="form-checkbox"
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save and Continue"}
        </button>
      </form>
    </div>
  );
}
