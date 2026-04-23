import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Owned documents
  const { data: owned } = await supabase
    .from("documents").select("*").eq("owner_id", userId).order("updated_at", { ascending: false });

  // Shared documents (join through shares table)
  const { data: sharedIds } = await supabase
    .from("shares").select("document_id").eq("user_id", userId);

  let shared = [];
  if (sharedIds && sharedIds.length > 0) {
    const ids = sharedIds.map((s) => s.document_id);
    const { data: sharedDocs } = await supabase
      .from("documents").select("*, users!documents_owner_id_fkey(name)").in("id", ids).order("updated_at", { ascending: false });
    shared = (sharedDocs || []).map((d) => ({ ...d, owner_name: d.users?.name }));
  }

  return NextResponse.json([...(owned || []), ...shared]);
}

export async function POST(req) {
  const { title, content, ownerId } = await req.json();
  const { data, error } = await supabase
    .from("documents")
    .insert({ title: title || "Untitled Document", content: content || "", owner_id: ownerId })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
