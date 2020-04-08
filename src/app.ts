// @ts-ignore
import { serve } from "https://deno.land/std/http/server.ts";
// @ts-ignore
import initRoutes from "./routes/init.ts";
// @ts-ignore
import getRouteHandler from "./router.ts";
// @ts-ignore
import { Request } from "./router.util.ts";

initRoutes();

const PORT = 8000;
const server = serve({ port: PORT });
console.log(`Serving http://localhost:${PORT}/`);

// @ts-ignore
for await (const req of server) {
  const handler = await getRouteHandler(req);
  if (!handler) {
    req.respond({ status: 404, body: "Not Found" });
    continue;
  }
  handler(req as Request);
}
