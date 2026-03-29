import "server-only";

import { buildApiQueryString } from "./helpers";
import type {
  MaterialRequestDetailResponse,
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

export async function getMaterialRequestById(id: number) {
  const response = await fetch(`${API_BASE_URL}/material-requests/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch material request #${id}.`);
  }

  return (await response.json()) as MaterialRequestDetailResponse;
}

export async function deleteMaterialRequestById(id: number) {
  const response = await fetch(`${API_BASE_URL}/material-requests/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete material request.");
  }
}
