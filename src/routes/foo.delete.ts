// @ts-ignore
import { foos } from "../repository.ts";
// @ts-ignore
import { addDelete, Request } from "../router.util.ts";

export default function initFooPut(): void {
  addDelete("/foo/:id", async function setFoo(req: Request): Promise<void> {
    const id = req.pathParams.id;
    const foo = foos.get(id);

    if (!foo) return req.respond({ status: 404, body: "Not Found" });

    foos.delete(id);
    return req.respond({ status: 200, body: "OK" });
  });
}
