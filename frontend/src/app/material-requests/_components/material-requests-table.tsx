import Link from "next/link";
import { deleteMaterialRequestAction } from "../actions";
import { buildListPageUrl } from "../helpers";
import type {
  MaterialRequestListResponse,
  MaterialRequestSearchParams,
} from "../types";

type Props = {
  response: MaterialRequestListResponse;
  searchParams: MaterialRequestSearchParams;
};

export function MaterialRequestsTable({ response, searchParams }: Props) {
  if (response.data.length === 0) {
    return <p className="text-sm text-gray-500 py-6">No material requests found.</p>;
  }

  const totalPages = Math.max(response.meta.totalPages, 1);
  const currentListUrl = buildListPageUrl(searchParams, response.meta.page);

  return (
    <div className="max-w-7xl mx-auto px-5">
      <table className="w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Request Number</th>
            <th className="px-4 py-3 text-left">Request Date</th>
            <th className="px-4 py-3 text-left">Requester</th>
            <th className="px-4 py-3 text-left">Purpose</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {response.data.map((request) => (
            <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{request.requestNumber}</td>
              <td className="px-4 py-3 text-gray-600">{request.requestDate}</td>
              <td className="px-4 py-3 text-gray-600">{request.requesterName}</td>
              <td className="px-4 py-3 text-gray-600">{request.purpose}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link href={`/material-requests/${request.id}/edit`} className="text-gray-900 no-underline hover:underline">
                    Edit
                  </Link>
                  <form action={deleteMaterialRequestAction}>
                    <input type="hidden" name="id" value={request.id} />
                    <input type="hidden" name="redirectTo" value={currentListUrl} />
                    <button type="submit" className="text-red-600 cursor-pointer hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <span>Total: {response.meta.total} · Page {response.meta.page} of {totalPages}</span>

        <div className="flex gap-2">
          {response.meta.page > 1 ? (
            <Link href={buildListPageUrl(searchParams, response.meta.page - 1)} className="border border-gray-300 rounded px-3 py-1 no-underline text-gray-700 hover:bg-gray-50">
              Previous
            </Link>
          ) : (
            <span className="border border-gray-200 rounded px-3 py-1 text-gray-300">Previous</span>
          )}

          {response.meta.page < totalPages ? (
            <Link href={buildListPageUrl(searchParams, response.meta.page + 1)} className="border border-gray-300 rounded px-3 py-1 no-underline text-gray-700 hover:bg-gray-50">
              Next
            </Link>
          ) : (
            <span className="border border-gray-200 rounded px-3 py-1 text-gray-300">Next</span>
          )}
        </div>
      </div>
    </div>
  );
}
