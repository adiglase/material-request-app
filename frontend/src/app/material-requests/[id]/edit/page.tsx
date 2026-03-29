import Link from "next/link";

export default async function EditMaterialRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main>
      <h1>Edit Material Request</h1>
      <p>Editing request #{id} will be built in the form ticket.</p>
      <p>
        <Link href="/">Back to list</Link>
      </p>
    </main>
  );
}