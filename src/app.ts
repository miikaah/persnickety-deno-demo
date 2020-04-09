// @ts-ignore
import { serve } from "https://deno.land/std/http/server.ts";
// @ts-ignore
import initRoutes from "./routes/init.ts";
// @ts-ignore
import getRouteHandler, { RouterRequest } from "./router.ts";

initRoutes();

const PORT = 8000;
const server = serve({ port: PORT });
console.log(`Serving http://localhost:${PORT}/`);

// @ts-ignore
for await (const req of server) {
  getRouteHandler(req).then(async (router: RouterRequest) => {
    const { handlers, request } = router;
    if (!handlers) {
      request.respondNotFound();
      return;
    }
    for (const handler of handlers) {
      await handler(request);
    }
  });
}
