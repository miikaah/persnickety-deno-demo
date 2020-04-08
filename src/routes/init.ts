// @ts-ignore
import initFooGet from "./foo.get.ts";
// @ts-ignore
import initFooPost from "./foo.post.ts";
// @ts-ignore
import initFooPut from "./foo.put.ts";

export default function initRoutes(): void {
  initFooGet();
  initFooPost();
  initFooPut();
}
