"use client";

import { useTransition } from "react";
import { updateBookingStatus, logout } from "./actions";

export function StatusButton({ bookingId, currentStatus }) {
  const [isPending, startTransition] = useTransition();

  const next =
    currentStatus === "pending"
      ? { value: "confirmed", label: "Konfirmasi", style: "bg-emerald-600 hover:bg-emerald-500 text-white" }
      : currentStatus === "confirmed"
      ? { value: "cancelled", label: "Batalkan", style: "bg-red-700 hover:bg-red-600 text-white" }
      : null;

  if (!next) {
    return (
      <span className="text-xs text-neutral-500 italic">—</span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(() => updateBookingStatus(bookingId, next.value))
      }
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${next.style}`}
    >
      {isPending ? "…" : next.label}
    </button>
  );
}

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
      className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-red-700 hover:text-red-400 disabled:opacity-40 transition-colors"
    >
      {isPending ? "Keluar…" : "Logout"}
    </button>
  );
}
