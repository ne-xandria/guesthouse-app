"use server";

import { supabase } from "@/lib/supabase";

export async function createBooking(formData) {
  const room_id = formData.get("room_id");
  const guest_name = formData.get("guest_name");
  const guest_phone = formData.get("guest_phone");
  const check_in = formData.get("check_in");
  const check_out = formData.get("check_out");

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.round(
    (new Date(check_out) - new Date(check_in)) / msPerDay
  );

  if (nights <= 0) {
    return { success: false, error: "Tanggal check-out harus setelah check-in." };
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("price_per_night")
    .eq("id", room_id)
    .single();

  if (roomError || !room) {
    return { success: false, error: "Kamar tidak ditemukan." };
  }

  const total_price = nights * room.price_per_night;

  const { error: insertError } = await supabase.from("bookings").insert({
    room_id,
    guest_name,
    guest_phone,
    check_in,
    check_out,
    total_price,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true };
}
