import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatPrice } from "../api";
import type { Listing } from "../types";
import { ConditionBadge } from "../components/ConditionBadge";

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api<Listing>(`/api/listings/${id}`)
      .then(setListing)
      .catch(() => setError("Listing not found."));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 text-slate-600">
        {error} <Link to="/" className="text-orange-600">Back to browse</Link>
      </div>
    );
  }

  if (!listing) {
    return <div className="mx-auto max-w-2xl px-4 py-6 text-slate-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/" className="text-sm text-orange-600 hover:underline">
        ← Back to browse
      </Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
          <ConditionBadge condition={listing.condition} />
        </div>

        <p className="mt-1 text-slate-500">{listing.edition} edition</p>
        <span className="mt-3 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {listing.unit_code}
        </span>

        <p className="mt-4 text-3xl font-bold text-slate-900">
          {formatPrice(listing.price_cents)}
        </p>

        <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
          Sold by <span className="font-medium">{listing.seller.name}</span>
          {" · "}★ {listing.seller.rating.toFixed(1)}
        </div>

        {/* No "message seller" and no "mark as sold" here on purpose: both are jobs. */}
      </div>
    </div>
  );
}
