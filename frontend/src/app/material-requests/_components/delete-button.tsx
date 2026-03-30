"use client";

type Props = {
  action: (formData: FormData) => void;
  id: number;
  redirectTo: string;
};

export function DeleteButton({ action, id, redirectTo }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this material request?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit" className="text-red-600 cursor-pointer hover:underline">
        Delete
      </button>
    </form>
  );
}
