"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const json = await res.json();
      login(json.access, json.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => alert("Google OAuth placeholder")}
          className="w-full border border-black py-2 rounded hover:bg-black hover:text-white transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
