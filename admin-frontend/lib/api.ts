const BASE_URL = "http://localhost:3000";

export async function adminLogin(data: any) {
  const res = await fetch(`${BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPrograms() {
  const res = await fetch(`${BASE_URL}/meta/programs`);
  return res.json();
}

export async function getDepartments(programId: string) {
  const res = await fetch(`${BASE_URL}/meta/departments/${programId}`);
  return res.json();
}

export async function createFaculty(data: any, token: string) {
  const res = await fetch(`${BASE_URL}/admin/faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}