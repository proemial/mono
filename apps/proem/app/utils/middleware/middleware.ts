import { NextMiddleware, NextResponse } from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function MiddlewareStack(
  functions: MiddlewareFactory[] = [],
  index = 0,
): NextMiddleware {
  console.log("In middleware");
  const current = functions[index];
  if (current) {
    const next = MiddlewareStack(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}
