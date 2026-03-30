import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaterialRequestById } from "../api";

export default async function ViewMaterialRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId < 1) {
    notFound();
  }

  const response = await getMaterialRequestById(numericId);

  if (!response) {
    notFound();
  }

  const req = response.data;

  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {req.requestNumber}
          </h1>
          <div className="flex gap-3">
            <Link
              href={`/material-requests/${req.id}/edit`}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm no-underline text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
            <Link
              href="/"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm no-underline text-gray-700 hover:bg-gray-50"
            >
              Back to List
            </Link>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <dt className="text-gray-500">Request Number</dt>
              <dd className="mt-1 font-medium text-gray-900">{req.requestNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Request Date</dt>
              <dd className="mt-1 font-medium text-gray-900">{req.requestDate}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Requester Name</dt>
              <dd className="mt-1 font-medium text-gray-900">{req.requesterName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Purpose</dt>
              <dd className="mt-1 font-medium text-gray-900">{req.purpose}</dd>
            </div>
            {req.notes && (
              <div className="col-span-2">
                <dt className="text-gray-500">Notes</dt>
                <dd className="mt-1 font-medium text-gray-900">{req.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        {req.materialDetails.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Material Details
            </h2>
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Specification</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {req.materialDetails.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">{item.description}</td>
                    <td className="px-4 py-3 text-gray-600">{item.specification ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-600 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3 text-gray-600">{item.remarks ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
