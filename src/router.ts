import {
  stripQueryFromUrl,
  getRequestBody,
  getHandlersWithParams,
  getParams,
  routeHandlers,
  Request,
  Response,
  ServerRequest,
  RequestHandler,
  // @ts-ignore
} from "./router.util.ts";

export type RouterRequest = {
  handlers: RequestHandler[] | undefined;
  request: Request;
};

export default async function getRouteHandler(
  req: ServerRequest
): Promise<RouterRequest> {
  const { url, query } = stripQueryFromUrl(req.url);
  const method = req.method;
  const handlers = routeHandlers.get(`${method}${url}`);

  const request = { ...req } as Request;

  request.queryParams = query;
  request.payload = await getRequestBody(req);

  // Monkey-patch respond to set s flag that tells that this request has already responded
  request.respond = async (res: Response): Promise<void> => {
    request.hasResponded = true;
    req.respond(res);
  };

  // Attach utility functions
  request.respondOk = (res?: Response): void => {
    request.response = { status: 200, body: "OK\n", ...res };
  };
  request.respondNotFound = (res?: Response): void => {
    request.response = { status: 404, body: "Not Found\n", ...res };
  };

  // No path params, we can return early
  if (handlers) {
    return { handlers, request };
  }

  const urlParts = url.split("/");
  const { routeKey, handlersWithParams } = getHandlersWithParams(
    url,
    method,
    urlParts
  );

  if (!handlersWithParams) return {} as RouterRequest;

  // Map params from url to params object in request object
  request.pathParams = getParams(routeKey, urlParts);

  return { handlers: handlersWithParams, request };
}
