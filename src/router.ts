import {
  stripQueryFromUrl,
  getRequestBody,
  getHandlerWithParams,
  getParams,
  routeHandlers,
  Request,
  ServerRequest,
  RequestHandler,
  // @ts-ignore
} from "./router.util.ts";

export default async function getRouteHandler(
  req: ServerRequest
): Promise<RequestHandler | undefined> {
  const { url, query } = stripQueryFromUrl(req.url);
  const method = req.method;
  const handler = routeHandlers.get(`${method}${url}`);
  (req as Request).queryParams = query;

  // Read body
  (req as Request).payload = await getRequestBody(req);

  // No path params, we can return early
  if (handler) return handler;

  const urlParts = url.split("/");
  const { routeKey, handlerWithParams } = getHandlerWithParams(
    url,
    method,
    urlParts
  );

  if (!handlerWithParams) return;

  // Map params from url to params object in request object
  (req as Request).pathParams = getParams(routeKey, urlParts);

  return handlerWithParams;
}
