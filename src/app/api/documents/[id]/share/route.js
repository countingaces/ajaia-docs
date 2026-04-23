import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  const { data, error } = await supabase
    .from("shares")
    .select("*, users(name, email)")
    .eq("document_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const flat = (data || []).map((s) => ({ ...s, name: s.users?.name, email: s.users?.email }));
  return NextResponse.json(flat);
}

export async function POST(req, { params }) {
  const { id } = params;
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const { data, error } = await supabase
    .from("shares")
    .insert({ document_id: id, user_id: userId })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Already shared" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
