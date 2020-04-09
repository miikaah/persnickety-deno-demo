// @ts-ignore
import { getFoo, removeFoo } from "../repository.ts";
// @ts-ignore
import { addDelete, Request } from "../router.util.ts";

export default function initFooPut(): void {
  addDelete("/foo/:id", async function setFoo(req: Request): Promise<void> {
    const id = req.pathParams.id;
    const foo = await getFoo(id);

    if (!foo) return req.respondNotFound();

    await removeFoo(id);

    req.respondOk();
  });
}
