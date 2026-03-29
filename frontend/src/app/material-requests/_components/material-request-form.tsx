"use client";

import Link from "next/link";
import { useState } from "react";
import { createMaterialRequestAction, updateMaterialRequestAction } from "../actions";
import type { MaterialRequestDetail } from "../types";

type DetailRow = {
  name: string;
  description: string;
  category: string;
  specification: string;
  quantity: string;
  unit: string;
  remarks: string;
};

const emptyRow = (): DetailRow => ({
  name: "", description: "", category: "", specification: "", quantity: "", unit: "", remarks: "",
});

type Props = { existing?: MaterialRequestDetail };

export function MaterialRequestForm({ existing }: Props) {
  const [requestNumber, setRequestNumber] = useState(existing?.requestNumber ?? "");
  const [requestDate, setRequestDate] = useState(existing?.requestDate ?? "");
  const [requesterName, setRequesterName] = useState(existing?.requesterName ?? "");
  const [purpose, setPurpose] = useState(existing?.purpose ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [rows, setRows] = useState<DetailRow[]>(() =>
    existing?.materialDetails.length
      ? existing.materialDetails.map((d) => ({
          name: d.name,
          description: d.description,
          category: d.category,
          specification: d.specification ?? "",
          quantity: String(d.quantity),
          unit: d.unit,
          remarks: d.remarks ?? "",
        }))
      : [emptyRow()]
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function setRow(i: number, field: keyof DetailRow, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      requestNumber,
      requestDate,
      requesterName,
      purpose,
      notes: notes || undefined,
      materialDetails: rows.map((r) => ({
        name: r.name,
        description: r.description,
        category: r.category,
        specification: r.specification || undefined,
        quantity: Number(r.quantity),
        unit: r.unit,
        remarks: r.remarks || undefined,
      })),
    };

    const result = existing
      ? await updateMaterialRequestAction(existing.id, payload)
      : await createMaterialRequestAction(payload);

    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const field = "border border-gray-300 rounded px-3 py-2 text-sm w-full";
  const cell = "border border-gray-200 rounded px-2 py-1 text-sm";

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request Number *</label>
          <input type="text" value={requestNumber} onChange={(e) => setRequestNumber(e.target.value)} required maxLength={30} className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Request Date *</label>
          <input type="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} required className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name *</label>
          <input type="text" value={requesterName} onChange={(e) => setRequesterName(e.target.value)} required maxLength={100} className={field} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
          <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} required className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={field} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Material Details</h2>
          <button type="button" onClick={() => setRows((p) => [...p, emptyRow()])} className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-50">
            + Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Name *</th>
                <th className="px-3 py-2 text-left">Description *</th>
                <th className="px-3 py-2 text-left">Category *</th>
                <th className="px-3 py-2 text-left">Specification</th>
                <th className="px-3 py-2 text-left">Qty *</th>
                <th className="px-3 py-2 text-left">Unit *</th>
                <th className="px-3 py-2 text-left">Remarks</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-2 py-1"><input type="text" value={row.name} onChange={(e) => setRow(i, "name", e.target.value)} required maxLength={150} className={`${cell} w-32`} /></td>
                  <td className="px-2 py-1"><input type="text" value={row.description} onChange={(e) => setRow(i, "description", e.target.value)} required className={`${cell} w-40`} /></td>
                  <td className="px-2 py-1"><input type="text" value={row.category} onChange={(e) => setRow(i, "category", e.target.value)} required maxLength={50} className={`${cell} w-28`} /></td>
                  <td className="px-2 py-1"><input type="text" value={row.specification} onChange={(e) => setRow(i, "specification", e.target.value)} className={`${cell} w-28`} /></td>
                  <td className="px-2 py-1"><input type="number" value={row.quantity} onChange={(e) => setRow(i, "quantity", e.target.value)} required min="0.01" step="0.01" className={`${cell} w-20`} /></td>
                  <td className="px-2 py-1"><input type="text" value={row.unit} onChange={(e) => setRow(i, "unit", e.target.value)} required maxLength={30} className={`${cell} w-20`} /></td>
                  <td className="px-2 py-1"><input type="text" value={row.remarks} onChange={(e) => setRow(i, "remarks", e.target.value)} className={`${cell} w-28`} /></td>
                  <td className="px-2 py-1">
                    {rows.length > 1 && (
                      <button type="button" onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-xs">
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={submitting} className="bg-gray-900 text-white text-sm px-6 py-2 rounded disabled:opacity-50 cursor-pointer">
          {submitting ? "Saving..." : existing ? "Save Changes" : "Create Request"}
        </button>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 no-underline">Cancel</Link>
      </div>
    </form>
  );
}
