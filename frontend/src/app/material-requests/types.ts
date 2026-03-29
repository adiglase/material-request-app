export type MaterialRequestSearchParamsInput = {
  requestNumber?: string | string[];
  requesterName?: string | string[];
  requestDateFrom?: string | string[];
  requestDateTo?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
};

export type MaterialRequestSearchParams = {
  requestNumber: string;
  requesterName: string;
  requestDateFrom: string;
  requestDateTo: string;
  page: number;
  pageSize: number;
};

export type MaterialRequest = {
  id: number;
  requestNumber: string;
  requestDate: string;
  requesterName: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
};

export type MaterialRequestListResponse = {
  data: MaterialRequest[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
