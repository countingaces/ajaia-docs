import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const ownerId = formData.get("ownerId");

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const name = file.name;
  const ext = name.split(".").pop().toLowerCase();
  if (!["txt", "md"].includes(ext)) {
    return NextResponse.json({ error: "Only .txt and .md files are supported" }, { status: 400 });
  }

  const text = await file.text();
  const title = name.replace(/\.[^/.]+$/, "");

  // Convert markdown-style content to basic HTML
  let content = text
    .split("\n")
    .map((line) => {
      if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.trim() === "") return "<p></p>";
      return `<p>${line}</p>`;
    })
    .join("");

  const { data, error } = await supabase
    .from("documents")
    .insert({ title, content, owner_id: ownerId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
