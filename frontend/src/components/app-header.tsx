import Link from "next/link";

export function AppHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold uppercase text-gray-900 no-underline">
          Material Requests
        </Link>

        <nav className="flex items-center gap-2 w-full">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 no-underline">
            Home
          </Link>
          <Link href="/material-requests/new" className="ml-auto bg-gray-900 text-white text-sm px-4 py-1.5 rounded no-underline">
            New Request
          </Link>
        </nav>
      </div>
    </header>
  );
}
