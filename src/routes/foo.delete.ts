// @ts-ignore
import { foos } from "../repository.ts";
// @ts-ignore
import { addPut, Request } from "../router.util.ts";

export default function initFooPut(): void {
  addPut("/foo/:id", async function setFoo(req: Request): Promise<void> {
    const id = req.pathParams.id;
    const payload = req.payload;
    foos.set(id, payload);
    return req.respond({ status: !foos.get(id) ? 201 : 200, body: payload });
  });
}
