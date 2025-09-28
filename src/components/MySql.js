export default async function MySql(n8nServer, query) {
    const res = await fetch(
        `${n8nServer}ae1d4436-f226-414f-b0b6-48ad23c7f04c`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query }),
        }
    );
  
    if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Server error: ${res.status} ${txt}`);
    }
  
    const data = await res.json();

    return data;
}
