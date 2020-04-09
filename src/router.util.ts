// @ts-ignore
import {
  ServerRequest,
  Response as ServerResponse,
} from "https://deno.land/std/http/server.ts";
// @ts-ignore
import { decode } from "https://deno.land/std/encoding/utf8.ts";
// @ts-ignore
export { ServerRequest } from "https://deno.land/std/http/server.ts";

export type Params = {
  [x: string]: any; // eslint-disable-line
};

export interface Response extends ServerResponse {} // eslint-disable-line

export interface Request extends ServerRequest {
  pathParams: Params;
  queryParams: Params;
  payload: any;
  response: Response;
  respond: (res: Response) => Promise<void>;
  respondOk: (res?: Response) => void;
  respondNotFound: (res?: Response) => void;
  hasResponded: boolean;
}

const defaultResponder = async (req: Request): Promise<void> => {
  if (req.hasResponded) return;
  return req.respond(req.response || { status: 200, body: "OK" });
};

export type RequestHandler = (req: Request) => Promise<void>;

export const routeHandlers = new Map<string, RequestHandler[]>();

const getHandlers = (handlers: RequestHandler[]): RequestHandler[] => {
  return [...handlers, defaultResponder];
};

export function addGet(path: string, ...handlers: RequestHandler[]): void {
  routeHandlers.set(`GET${path}`, getHandlers(handlers));
}

export function addPost(path: string, ...handlers: RequestHandler[]): void {
  routeHandlers.set(`POST${path}`, getHandlers(handlers));
}

export function addPut(path: string, ...handlers: RequestHandler[]): void {
  routeHandlers.set(`PUT${path}`, getHandlers(handlers));
}

export function addDelete(path: string, ...handlers: RequestHandler[]): void {
  routeHandlers.set(`DELETE${path}`, getHandlers(handlers));
}

interface Query {
  [x: string]: string;
}

const getQueryAsObject = (queryString: string): Query => {
  const queryParts = queryString.split("&");
  return queryParts
    .map((param) => {
      const paramParts = param.split("=");
      return { [paramParts[0]]: paramParts[1] };
    })
    .reduce((param, acc) => ({ ...acc, ...param }));
};

interface UrlAndQuery {
  url: string;
  query: Query;
}

export const stripQueryFromUrl = (url: string): UrlAndQuery => {
  if (!url.includes("?")) {
    return {
      url,
      query: {},
    };
  }
  const urlParts = url.split("?");
  return {
    url: urlParts[0],
    query: getQueryAsObject(urlParts[1]),
  };
};

const parseBodyByContentType = (
  req: ServerRequest,
  payload: string
): object | string => {
  const contentType = req.headers.get("content-type");
  if (contentType === "application/json") {
    return JSON.parse(payload);
  }
  console.warn(`Content type "${contentType}" is not handled currently`);
  return payload;
};

export const getRequestBody = async (
  req: ServerRequest
): Promise<object | string> => {
  if (!req.contentLength) return "";

  const buf = new Uint8Array(req.contentLength);
  let bufSlice = buf;
  let totRead = 0;
  // eslint-disable-next-line
  while (true) {
    const nread = await req.body.read(bufSlice);
    // @ts-ignore
    if (nread === Deno.EOF) break;
    totRead += nread;
    if (totRead >= req.contentLength) break;
    bufSlice = bufSlice.subarray(nread);
  }
  const payload = decode(bufSlice);
  return parseBodyByContentType(req, payload);
};

interface HandlerWithParams {
  routeKey: string | unknown;
  handlersWithParams: RequestHandler[] | undefined;
}

export const getHandlersWithParams = (
  url: string,
  method: string,
  urlParts: string[]
): HandlerWithParams => {
  const hasTrailingSlash = url.endsWith("/");
  const urlLength = urlParts.length - (hasTrailingSlash ? 1 : 0);
  const urlRoot = `${method}/${urlParts[1]}`;
  const routes = Array.from(routeHandlers.keys());
  const routeKey = routes.find((route: string) => {
    const routeParts = route.split("/");
    return (
      route.startsWith(urlRoot) &&
      routeParts.length === urlLength &&
      routeParts.every((routePart, index) => {
        const urlPart = urlParts[index];
        return (
          urlPart === routePart || urlPart === "" || routePart.includes(":")
        );
      })
    );
  });
  const handlersWithParams = routeHandlers.get(routeKey || "");
  return { routeKey, handlersWithParams };
};

export const getParams = (
  routeKey: string | unknown,
  urlParts: string[]
): Params => {
  const paramIndexes: number[] = [];
  const paramNames = (routeKey as string)
    .split("/")
    .filter((part, index) => {
      if (part.includes(":")) {
        paramIndexes.push(index);
        return true;
      }
    })
    .map((paramName) => paramName.replace(":", ""));
  return paramNames
    .map((name, index) => ({ [name]: urlParts[paramIndexes[index]] }))
    .reduce((param, acc) => ({ ...acc, ...param }));
};
