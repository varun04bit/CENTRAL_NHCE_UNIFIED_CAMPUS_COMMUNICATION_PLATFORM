"use client";
import { useRouter } from "next/navigation";
import { logout, getToken } from "@/lib/auth";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.push("/login");
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="title">Admin Dashboard</div>

        <button
          className="button"
          onClick={() => router.push("/faculty/create")}
        >
          Create Faculty
        </button>

        <button
          className="link-button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}