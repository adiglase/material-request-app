"use server";

import { redirect } from "next/navigation";
import { deleteMaterialRequestById } from "./api";

export async function deleteMaterialRequestAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!Number.isInteger(id) || id < 1) {
    throw new Error("Invalid request id.");
  }

  await deleteMaterialRequestById(id);
  redirect(redirectTo);
}
