import Link from "next/link";
import type { MaterialRequestSearchParams } from "../types";

type Props = {
  defaultValues: MaterialRequestSearchParams;
};

export function MaterialRequestFilters({ defaultValues }: Props) {
  return (
    <form action="/" method="GET" className="w-full">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="requestNumber" className="block text-xs text-gray-500 mb-1">
              Request Number
            </label>
            <input
              id="requestNumber"
              name="requestNumber"
              placeholder="e.g. MR-001"
              defaultValue={defaultValues.requestNumber}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="requesterName" className="block text-xs text-gray-500 mb-1">
              Requester Name
            </label>
            <input
              id="requesterName"
              name="requesterName"
              placeholder="e.g. John Doe"
              defaultValue={defaultValues.requesterName}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="requestDateFrom" className="block text-xs text-gray-500 mb-1">
              Date From
            </label>
            <input
              id="requestDateFrom"
              name="requestDateFrom"
              type="date"
              defaultValue={defaultValues.requestDateFrom}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          </div>

          <div>
            <label htmlFor="requestDateTo" className="block text-xs text-gray-500 mb-1">
              Date To
            </label>
            <input
              id="requestDateTo"
              name="requestDateTo"
              type="date"
              defaultValue={defaultValues.requestDateTo}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded cursor-pointer"
          >
            Apply Filters
          </button>
          <Link href="/" className="text-sm text-gray-500 no-underline">
            Reset
          </Link>
        </div>
      </div>

      <input type="hidden" name="page" value="1" />
      <input type="hidden" name="pageSize" value={defaultValues.pageSize} />
    </form>
  );
}
