"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {toast, Zoom } from "react-toastify";
import { HTTP_BACKEND } from "@/config";
interface AuthPageProps {
  isSignin: boolean;
}

export default function AuthPage({ isSignin }: AuthPageProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isSignin
      ? `${HTTP_BACKEND}/signin`
      : `${HTTP_BACKEND}/signup`;
    const payload = isSignin
      ? { username, password }
      : { username, name, password };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      if (isSignin) {
        // Expecting { token: string } in response
        const token = data.token;
        const authHeader = `${token}`;
        // Save header in localStorage
        localStorage.setItem("authorization", authHeader);
        // Set axios default for future requests
        axios.defaults.headers.common["Authorization"] = authHeader;
      }
      toast.dark("Authentication succesfully completed",{
        transition:Zoom,
        delay:200,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Auth failed");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {!isSignin && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
