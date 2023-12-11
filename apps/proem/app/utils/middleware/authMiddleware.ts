import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { initAuth0 } from '@auth0/nextjs-auth0/edge';
import { MiddlewareFactory } from "./middleware";

const matcher = ['/page-router/profile-middleware', '/profile-middleware'];
const login = '/api/page-router-auth/login';

const auth0Instance = initAuth0({ routes: { login } });
const auth0Middleware = auth0Instance.withMiddlewareAuthRequired();

export const authMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    return (matcher.includes(request.nextUrl.pathname))
      ? auth0Middleware(request, _next)
      : next(request, _next);
  };
};
