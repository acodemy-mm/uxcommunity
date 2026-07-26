/**
 * Confirms all Auth users (clears "Email not confirmed").
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 *   node scripts/confirm-auth-emails.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
if (error) {
  console.error("listUsers failed:", error.message);
  process.exit(1);
}

let confirmed = 0;
for (const user of data.users) {
  if (user.email_confirmed_at) continue;
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });
  if (updateError) {
    console.error("Failed for", user.email, updateError.message);
  } else {
    confirmed += 1;
    console.log("Confirmed:", user.email);
  }
}

console.log(`Done. Newly confirmed: ${confirmed}. Total users: ${data.users.length}`);
