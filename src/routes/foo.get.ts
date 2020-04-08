// @ts-ignore
import { getAllFoos, getFoo } from "../repository.ts";
// @ts-ignore
import { addGet, Request } from "../router.util.ts";

export default function initFooGet(): void {
  addGet("/foo", async function getFoo(req: Request): Promise<void> {
    return req.respond({
      status: 200,
      body: JSON.stringify(await getAllFoos()),
    });
  });
  addGet("/foo/:id", async function getFooById(req: Request): Promise<void> {
    const foo = await getFoo(req.pathParams.id);

    if (!foo) return req.respond({ status: 404, body: "Not Found\n" });

    return req.respond({ status: 200, body: JSON.stringify(foo) });
  });
}
