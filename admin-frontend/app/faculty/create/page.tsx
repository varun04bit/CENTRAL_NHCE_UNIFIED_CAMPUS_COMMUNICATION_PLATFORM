"use client";
import { useEffect, useState } from "react";
import { getPrograms, getDepartments, createFaculty } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function CreateFaculty() {
  const router = useRouter();
  const token = getToken();

  const [programs, setPrograms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    tempPassword: "",
    departmentId: "",
  });

  useEffect(() => {
    if (!token) router.push("/login");
    loadPrograms();
  }, []);

  async function loadPrograms() {
    const data = await getPrograms();
    setPrograms(data);
  }

  async function handleProgramChange(programId: string) {
    setForm((prev) => ({ ...prev, departmentId: "" }));
    if (!programId) {
      setDepartments([]);
      return;
    }
    const data = await getDepartments(programId);
    setDepartments(Array.isArray(data) ? data : []);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await createFaculty(form, token!);
    alert(res.message);
  }

  return (
    <div className="container">
      <div className="card">
        <div className="title">Create Faculty</div>

        <form onSubmit={handleSubmit}>
          <input className="input"
            placeholder="Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input className="input"
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input className="input"
            placeholder="Temporary Password"
            onChange={(e) =>
              setForm({ ...form, tempPassword: e.target.value })
            }
          />

          <select
            className="input"
            onChange={(e) => handleProgramChange(e.target.value)}
          >
            <option value="">Select Program</option>
            {programs.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            className="input"
            value={form.departmentId}
            onChange={(e) =>
              setForm({ ...form, departmentId: e.target.value })
            }
          >
            <option value="">Select Department</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <button className="button">Create Faculty</button>
        </form>
      </div>
    </div>
  );
}