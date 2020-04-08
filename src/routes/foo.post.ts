// @ts-ignore
import { fooPosts } from "../repository.ts";
// @ts-ignore
import { addPost, Request } from "../router.util.ts";

export default function initFooPost(): void {
  addPost("/foo", async function setFoo(req: Request): Promise<void> {
    fooPosts.push(req.payload.fooPost);
    return req.respond({ status: 200, body: "OK" });
  });
}
