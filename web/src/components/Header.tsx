import { Link } from "react-router-dom";
import { useCurrentUser } from "../currentUser";

export function Header() {
  const { users, current, setCurrent } = useCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Shelf<span className="text-orange-600">Swap</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-slate-600 hover:text-slate-900">
            Browse
          </Link>
          <Link
            to="/new"
            className="rounded-lg bg-orange-600 px-3 py-1.5 font-medium text-white hover:bg-orange-700"
          >
            Sell a book
          </Link>

          {/* Stand-in for login: pick who you are. Replacing this is a workshop job. */}
          <label className="flex items-center gap-1 text-slate-500">
            <span className="hidden sm:inline">Signed in as</span>
            <select
              className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-800"
              value={current?.id ?? ""}
              onChange={(e) => {
                const picked = users.find((u) => u.id === e.target.value);
                if (picked) setCurrent(picked);
              }}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
        </nav>
      </div>
    </header>
  );
}
