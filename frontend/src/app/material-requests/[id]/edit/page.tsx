import { notFound } from "next/navigation";
import { getMaterialRequestById } from "../../api";
import { MaterialRequestForm } from "../../_components/material-request-form";

export default async function EditMaterialRequestPage({
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

  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Edit Request: {response.data.requestNumber}
        </h1>
      </div>
      <MaterialRequestForm existing={response.data} />
    </section>
  );
}
