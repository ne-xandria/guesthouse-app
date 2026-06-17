import { createClient } from "@/lib/supabase/server";
import { StatusButton, LogoutButton } from "./BookingActions";

async function getBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*, rooms(name)")
    .order("created_at", { ascending: false });

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

function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLE = {
  pending:   "bg-amber-900/40 text-amber-400 border border-amber-700/50",
  confirmed: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/50",
  cancelled: "bg-red-900/40 text-red-400 border border-red-700/50",
};

const STATUS_LABEL = {
  pending:   "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export default async function AdminPage() {
  const bookings = await getBookings();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-500">
              NexaStay
            </p>
            <h1 className="text-lg font-bold text-white leading-tight">
              Admin Panel
            </h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-200">
            Daftar Booking
          </h2>
          <span className="text-sm text-neutral-500">
            {bookings.length} entri
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-neutral-500">Belum ada booking masuk.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900 text-left">
                  {[
                    "Nama Tamu",
                    "No. HP",
                    "Kamar",
                    "Check-in",
                    "Check-out",
                    "Total",
                    "Status",
                    "Dibuat",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="bg-neutral-950 hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      {b.guest_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">
                      {b.guest_phone}
                    </td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                      {b.rooms?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">
                      {formatDate(b.check_in)}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 whitespace-nowrap">
                      {formatDate(b.check_out)}
                    </td>
                    <td className="px-4 py-3 text-amber-400 font-semibold whitespace-nowrap">
                      {formatRupiah(b.total_price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLE[b.status] ?? "text-neutral-400"
                        }`}
                      >
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                      {formatDate(b.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusButton
                        bookingId={b.id}
                        currentStatus={b.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
