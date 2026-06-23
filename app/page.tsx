import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("projects")
    .select("*");

  return (
    <main style={{ padding: "40px" }}>
      <h1>SEO Assistant</h1>

      {error && (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      )}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
