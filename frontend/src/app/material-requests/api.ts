import "server-only";

import { buildApiQueryString } from "./helpers";
import type {
  MaterialRequestListResponse,
  MaterialRequestSearchParams,
} from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

export async function getMaterialRequests(
  searchParams: MaterialRequestSearchParams
) {
  const queryString = buildApiQueryString(searchParams);

  const response = await fetch(
    `${API_BASE_URL}/material-requests?${queryString}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch material requests.");
  }

  return (await response.json()) as MaterialRequestListResponse;
}

export async function deleteMaterialRequestById(id: number) {
  const response = await fetch(`${API_BASE_URL}/material-requests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete material request.");
  }
}
