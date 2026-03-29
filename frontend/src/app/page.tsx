import { getMaterialRequests } from "@/app/material-requests/api";
import { MaterialRequestFilters } from "@/app/material-requests/_components/material-request-filters";
import { MaterialRequestsTable } from "@/app/material-requests/_components/material-requests-table";
import { normalizeSearchParams } from "@/app/material-requests/helpers";
import type {
  MaterialRequestListResponse,
  MaterialRequestSearchParamsInput,
} from "@/app/material-requests/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<MaterialRequestSearchParamsInput>;
}) {
  const normalizedSearchParams = normalizeSearchParams(await searchParams);

  let response: MaterialRequestListResponse | null = null;
  let errorMessage: string | null = null;

  try {
    response = await getMaterialRequests(normalizedSearchParams);
  } catch {
    errorMessage = "Failed to load material requests.";
  }

  return (
    <section className="py-10">
      <MaterialRequestFilters defaultValues={normalizedSearchParams} />

      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : response ? (
        <MaterialRequestsTable
          response={response}
          searchParams={normalizedSearchParams}
        />
      ) : null}
    </section>
  );
}
