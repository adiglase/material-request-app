"use server";

import { redirect } from "next/navigation";
import { deleteMaterialRequestById } from "./api";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

type DetailPayload = {
  name: string;
  description: string;
  category: string;
  specification?: string;
  quantity: number;
  unit: string;
  remarks?: string;
};

type RequestPayload = {
  requestNumber: string;
  requestDate: string;
  requesterName: string;
  purpose: string;
  notes?: string;
  materialDetails: DetailPayload[];
};

export async function deleteMaterialRequestAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Invalid request id.");
  }

  await deleteMaterialRequestById(id);
  redirect(redirectTo);
}

export async function createMaterialRequestAction(
  payload: RequestPayload
): Promise<{ error: string } | undefined> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/material-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { error: "Could not reach the API. Please try again." };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: formatError(body?.message) };
  }

  redirect("/");
}

export async function updateMaterialRequestAction(
  id: number,
  payload: RequestPayload
): Promise<{ error: string } | undefined> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/material-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { error: "Could not reach the API. Please try again." };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: formatError(body?.message) };
  }

  redirect("/");
}

function formatError(message: unknown): string {
  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string") return message;
  return "Something went wrong. Please check your inputs.";
}
