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
  addGet("/foo/:id/:param", async function getFooParamById(
    req: Request
  ): Promise<void> {
    const foo = await getFoo(req.pathParams.id);
    const param = foo?.[req.pathParams.param];

    if (!foo || !param)
      return req.respond({ status: 404, body: "Not Found\n" });

    return req.respond({ status: 200, body: param });
  });
  addGet("/foo/:id/bar/:foo", async function getFooParamById(
    req: Request
  ): Promise<void> {
    return req.respond({
      status: 200,
      body: JSON.stringify({ route: "/foo/:id/bar/:foo", ...req.pathParams }),
    });
  });
  addGet("/foo/:id/foo/:foo", async function getFooParamById(
    req: Request
  ): Promise<void> {
    return req.respond({
      status: 200,
      body: JSON.stringify({ route: "/foo/:id/foo/:foo", ...req.pathParams }),
    });
  });
  addGet("/foo/foo", async function getFooByFoo(req: Request): Promise<void> {
    return req.respond({
      status: 200,
      body: JSON.stringify(await getFoo("a")),
    });
  });
}
