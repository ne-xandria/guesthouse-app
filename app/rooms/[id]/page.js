import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

async function getRoom(id) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  return data;
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function RoomDetailPage({ params }) {
  const { id } = await params;
  const room = await getRoom(id);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Back link */}
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-8 space-y-10">
        {/* Foto besar */}
        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-neutral-800">
          {room.image_url ? (
            <Image
              src={room.image_url}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-600 text-sm">
              Tidak ada foto
            </div>
          )}
        </div>

        {/* Info kamar */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Kiri: nama + deskripsi */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {room.name}
            </h1>
            {room.description && (
              <p className="text-neutral-400 leading-relaxed text-base">
                {room.description}
              </p>
            )}
          </div>

          {/* Kanan: kapasitas + harga */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 h-fit">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-amber-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 110-8 4 4 0 010 8z"
                />
              </svg>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">
                  Kapasitas
                </p>
                <p className="text-white font-medium">{room.capacity} tamu</p>
              </div>
            </div>

            <div className="h-px bg-neutral-800" />

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">
                Harga per malam
              </p>
              <p className="text-2xl font-bold text-amber-400">
                {formatRupiah(room.price_per_night)}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder form booking */}
        <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/50 p-8 text-center">
          <p className="text-neutral-500 text-sm">
            Form booking akan ditampilkan di sini.
          </p>
        </div>
      </main>
    </div>
  );
}
