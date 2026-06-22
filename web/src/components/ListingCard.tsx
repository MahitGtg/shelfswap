import { Link } from "react-router-dom";
import { formatPrice } from "../api";
import type { Listing } from "../types";
import { ConditionBadge } from "./ConditionBadge";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug text-slate-900">
          {listing.title}
        </h3>
        <ConditionBadge condition={listing.condition} />
      </div>

      <p className="mt-1 text-sm text-slate-500">{listing.edition} edition</p>

      <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {listing.unit_code}
      </span>

      <div className="mt-3 flex items-end justify-between">
        <span className="text-lg font-bold text-slate-900">
          {formatPrice(listing.price_cents)}
        </span>
        <span className="text-xs text-slate-500">
          {listing.seller.name} · ★ {listing.seller.rating.toFixed(1)}
        </span>
      </div>
    </Link>
  );
}
