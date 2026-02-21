"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await adminLogin({ email, password });

    if (res.token) {
      saveToken(res.token);
      router.push("/dashboard");
    } else {
      alert(res.message || "Invalid credentials");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="title">Admin Sign In</div>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button">Sign In</button>
        </form>
      </div>
    </div>
  );
}