import { supabase } from "@/lib/supabase";

export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase connection check failed:", err);
    return false;
  }
}
