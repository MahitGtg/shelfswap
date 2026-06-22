import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useCurrentUser } from "../currentUser";
import type { Listing } from "../types";

const CONDITIONS = ["new", "like_new", "good", "fair", "poor"];

export function CreateListing() {
  const { current } = useCurrentUser();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [unitCode, setUnitCode] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("good");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!current) {
      setError("Pick who you are in the header first.");
      return;
    }
    try {
      await api<Listing>("/api/listings", {
        method: "POST",
        body: JSON.stringify({
          title,
          edition,
          unit_code: unitCode,
          price_cents: Math.round(parseFloat(price || "0") * 100),
          condition,
          seller_id: current.id,
        }),
      });
      navigate("/");
    } catch {
      setError("Could not create the listing.");
    }
  }

  const field =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none";

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">List a book</h1>

      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input className={field} value={title} required
            onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Edition
          <input className={field} value={edition} required placeholder="e.g. 3rd"
            onChange={(e) => setEdition(e.target.value)} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Unit code
          <input className={field} value={unitCode} required placeholder="e.g. CITS3403"
            onChange={(e) => setUnitCode(e.target.value)} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Price (AUD)
          <input className={field} value={price} required type="number" min="0" step="0.01"
            placeholder="49.99" onChange={(e) => setPrice(e.target.value)} />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Condition
          <select className={field} value={condition}
            onChange={(e) => setCondition(e.target.value)}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c.replace("_", " ")}</option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit"
          className="w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700">
          Post listing
        </button>
      </form>
    </div>
  );
}
