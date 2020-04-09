// @ts-ignore
import { getAllFoos, getFoo } from "../repository.ts";
// @ts-ignore
import { addGet, Request } from "../router.util.ts";

const auditLogger = async (req: Request): Promise<void> => {
  console.log(`Requested: ${req.pathParams.id}`);
};

const wait = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
};

const waiter = async (): Promise<void> => {
  await wait();
  console.log("wait over");
};

export default function initFooGet(): void {
  addGet("/foo", async function getFoo(req: Request): Promise<void> {
    req.respondOk({ body: JSON.stringify(await getAllFoos()) });
  });
  addGet(
    "/foo/:id",
    auditLogger,
    async function getFooById(req: Request): Promise<void> {
      const foo = await getFoo(req.pathParams.id);

      if (!foo) return req.respondNotFound();

      req.respondOk({ body: JSON.stringify(foo) });
    },
    waiter
  );
  addGet("/foo/:id/:param", async function getFooParamById(
    req: Request
  ): Promise<void> {
    const foo = await getFoo(req.pathParams.id);
    const param = foo?.[req.pathParams.param];

    if (!foo || !param) return req.respondNotFound();

    req.respondOk({ body: param });
  });
  addGet("/foo/:id/bar/:foo", async function getFooParamById(
    req: Request
  ): Promise<void> {
    req.respondOk({
      body: JSON.stringify({ route: "/foo/:id/bar/:foo", ...req.pathParams }),
    });
  });
  addGet("/foo/:id/foo/:foo", async function getFooParamById(
    req: Request
  ): Promise<void> {
    req.respondOk({
      body: JSON.stringify({ route: "/foo/:id/foo/:foo", ...req.pathParams }),
    });
  });
  addGet("/foo/foo", async function getFooByFoo(req: Request): Promise<void> {
    req.respondOk({
      body: JSON.stringify(await getFoo("a")),
    });
  });
}
