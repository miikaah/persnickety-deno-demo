// @ts-ignore
import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8000;

const s = serve({ port: PORT });
console.log(`Serving http://localhost:${PORT}/`);

// @ts-ignore
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
