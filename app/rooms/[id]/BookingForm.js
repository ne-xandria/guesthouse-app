"use client";

import { useState, useTransition } from "react";
import { createBooking } from "./actions";

export default function BookingForm({ room_id }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const checkIn = formData.get("check_in");
    const checkOut = formData.get("check_out");
    if (checkOut <= checkIn) {
      setError("Tanggal check-out harus setelah check-in.");
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await createBooking(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error ?? "Terjadi kesalahan. Coba lagi.");
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-amber-700/40 bg-amber-950/30 p-8 text-center space-y-3">
        <div className="flex justify-center">
          <svg
            className="w-10 h-10 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-amber-300">
          Booking Berhasil!
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Terima kasih telah memesan. Kami akan menghubungi kamu lewat WhatsApp
          untuk konfirmasi lebih lanjut.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">Formulir Booking</h2>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="room_id" value={room_id} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400">
              Nama Tamu
            </label>
            <input
              type="text"
              name="guest_name"
              required
              placeholder="Nama lengkap"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400">
              No. HP / WhatsApp
            </label>
            <input
              type="tel"
              name="guest_phone"
              required
              placeholder="08xxxxxxxxxx"
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400">
              Check-in
            </label>
            <input
              type="date"
              name="check_in"
              required
              min={today}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400">
              Check-out
            </label>
            <input
              type="date"
              name="check_out"
              required
              min={today}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPending ? "Memproses…" : "Konfirmasi Booking"}
        </button>
      </form>
    </div>
  );
}
