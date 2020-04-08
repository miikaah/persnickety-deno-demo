// @ts-ignore
import initFooGet from "./foo.get.ts";
// @ts-ignore
import initFooPut from "./foo.put.ts";
// @ts-ignore
import initFooDelete from "./foo.delete.ts";

export default function initRoutes(): void {
  initFooGet();
  initFooPut();
  initFooDelete();
}
