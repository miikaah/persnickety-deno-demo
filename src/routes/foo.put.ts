// @ts-ignore
import { getFoo, addFoo } from "../repository.ts";
// @ts-ignore
import { addPut, Request } from "../router.util.ts";

export default function initFooPut(): void {
  addPut("/foo/:id", async function setFoo(req: Request): Promise<void> {
    const id = req.pathParams.id;
    const payload = req.payload;
    const foo = await getFoo(id);

    await addFoo(payload);

    req.respond({
      status: !foo ? 201 : 200,
      body: JSON.stringify(payload),
    });
  });
}
