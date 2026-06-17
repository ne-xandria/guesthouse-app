import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

async function getRooms() {
  const { data, error } = await supabase.from("rooms").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function Home() {
  const rooms = await getRooms();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-amber-900/30">
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] uppercase text-amber-500">
          NexaStay
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Guest House{" "}
          <span className="text-amber-400">Bunaken Residence</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
          Nikmati sewa kamar harian yang nyaman, bersih, dan elegan — tepat di
          jantung keindahan Bunaken.
        </p>
        <div className="mt-8 h-px w-16 bg-amber-500/60 mx-auto" />
      </section>

      {/* Room Grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-2xl font-semibold text-neutral-200 tracking-tight">
          Pilihan Kamar
        </h2>

        {rooms.length === 0 ? (
          <p className="text-neutral-500">Belum ada kamar tersedia.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-lg hover:border-amber-700/60 transition-colors duration-300"
              >
                {/* Photo */}
                <div className="relative h-52 w-full bg-neutral-800">
                  {room.image_url ? (
                    <Image
                      src={room.image_url}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600 text-sm">
                      Tidak ada foto
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5 gap-3">
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {room.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0"
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
                    {room.capacity} tamu
                  </div>

                  <p className="text-amber-400 font-semibold text-base">
                    {formatRupiah(room.price_per_night)}{" "}
                    <span className="text-neutral-500 font-normal text-sm">
                      / malam
                    </span>
                  </p>

                  <div className="mt-auto pt-3">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="block w-full rounded-xl bg-amber-500 px-4 py-2.5 text-center text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors duration-200"
                    >
                      Lihat &amp; Booking
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
