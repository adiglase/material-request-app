import { MaterialRequestForm } from "../_components/material-request-form";

export default function NewMaterialRequestPage() {
  return (
    <section className="py-6">
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <h1 className="text-xl font-semibold text-gray-900">New Material Request</h1>
      </div>
      <MaterialRequestForm />
    </section>
  );
}
