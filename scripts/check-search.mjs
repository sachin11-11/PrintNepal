import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const term = "silver";

const [services, materials] = await Promise.all([
  supabase
    .from("services")
    .select("title, slug")
    .or(`title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`),
  supabase
    .from("materials")
    .select("name, type")
    .or(`name.ilike.%${term}%,description.ilike.%${term}%,type.ilike.%${term}%`)
]);

if (services.error) {
  throw services.error;
}

if (materials.error) {
  throw materials.error;
}

console.log({
  serviceResults: services.data.length,
  materialResults: materials.data.length
});
