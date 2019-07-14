import { Request, Response, NextFunction } from "express";

type RouteType<T> = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<T>;
type ResultHandler<T> = (result: T, res: Response) => void;

function asyncRouteHandler<T = any>(
  route: RouteType<T>,
  then?: ResultHandler<T> | null,
  successStatusCode?: number
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await route(req, res, next);
      if (successStatusCode) res.status(successStatusCode);
      if (then) then(result, res);
    } catch (err) {
      next(err);
    }
  };
}

export function wrapAsync(route: RouteType<any>) {
  return asyncRouteHandler(route);
}

export function wrapAsyncAndSend(
  route: RouteType<any>,
  successStatusCode = 200
) {
  return asyncRouteHandler(
    route,
    (value, res) => res.send(value),
    successStatusCode
  );
}
