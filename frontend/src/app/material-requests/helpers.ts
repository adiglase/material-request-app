import type {
  MaterialRequestSearchParams,
  MaterialRequestSearchParamsInput,
} from "./types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

function readSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function parsePositiveInteger(value: string, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function normalizeSearchParams(
  input: MaterialRequestSearchParamsInput
): MaterialRequestSearchParams {
  const page = parsePositiveInteger(
    readSingleValue(input.page),
    DEFAULT_PAGE
  );

  const rawPageSize = parsePositiveInteger(
    readSingleValue(input.pageSize),
    DEFAULT_PAGE_SIZE
  );

  return {
    requestNumber: readSingleValue(input.requestNumber).trim(),
    requesterName: readSingleValue(input.requesterName).trim(),
    requestDateFrom: readSingleValue(input.requestDateFrom).trim(),
    requestDateTo: readSingleValue(input.requestDateTo).trim(),
    page,
    pageSize: Math.min(rawPageSize, MAX_PAGE_SIZE),
  };
}

export function buildApiQueryString(searchParams: MaterialRequestSearchParams) {
  const params = new URLSearchParams();

  if (searchParams.requestNumber) {
    params.set("requestNumber", searchParams.requestNumber);
  }

  if (searchParams.requesterName) {
    params.set("requesterName", searchParams.requesterName);
  }

  if (searchParams.requestDateFrom) {
    params.set("requestDateFrom", searchParams.requestDateFrom);
  }

  if (searchParams.requestDateTo) {
    params.set("requestDateTo", searchParams.requestDateTo);
  }

  params.set("page", String(searchParams.page));
  params.set("pageSize", String(searchParams.pageSize));

  return params.toString();
}

export function buildListPageUrl(
  searchParams: MaterialRequestSearchParams,
  page = searchParams.page
) {
  const params = new URLSearchParams();

  if (searchParams.requestNumber) {
    params.set("requestNumber", searchParams.requestNumber);
  }

  if (searchParams.requesterName) {
    params.set("requesterName", searchParams.requesterName);
  }

  if (searchParams.requestDateFrom) {
    params.set("requestDateFrom", searchParams.requestDateFrom);
  }

  if (searchParams.requestDateTo) {
    params.set("requestDateTo", searchParams.requestDateTo);
  }

  params.set("page", String(page));
  params.set("pageSize", String(searchParams.pageSize));

  const queryString = params.toString();

  return queryString ? `/?${queryString}` : "/";
}
