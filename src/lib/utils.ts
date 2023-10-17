import { TOKEN_EXPIRES_MIN, TOKEN_RESEND_MIN } from './constant';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import path from 'path';
import { fileURLToPath } from 'url';
import { getInvalidQueryParamsResponse } from './response';
import { ZodError } from 'zod';
import { addMinutes } from 'date-fns';
import { SQL, sql, InferSelectModel, getTableColumns } from 'drizzle-orm';
import { SelectedFields } from 'drizzle-orm/pg-core';
import { AuthToken } from '@/db/tables/auth-tokens';
import { classifyErrorType } from './validator';
import { users } from '@/db/schema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolvePathWithImportUrl(url: string, fragments: string[]) {
  const filePath = path.dirname(fileURLToPath(url));
  return path.resolve(filePath, ...fragments);
}

export function createInvalidPayloadResponse(error: ZodError) {
  const { body, query } = classifyErrorType(error);
  if (query) {
    return getInvalidQueryParamsResponse(query);
  }

  return getInvalidQueryParamsResponse(body!);
}

export function evaluateAuthToken(
  token: AuthToken,
  { currentIp }: { currentIp?: string | null }
) {
  return {
    expired: new Date(token.expiresIn).getTime() < Date.now(),
    allowResend:
      currentIp === token.userIp &&
      new Date(token.createdAt!).getTime() <
        addMinutes(new Date(), TOKEN_EXPIRES_MIN).getTime(),
  };
}

export function createClientAuthTokenInfo(token: AuthToken) {
  return {
    formFieldLength: token.token.length,
    retryAfter: addMinutes(
      new Date(token.createdAt!),
      TOKEN_RESEND_MIN
    ).toISOString(),
  };
}

interface RouteIsActiveProps {
  currentRoute: string;
  activeRoute: string;
}

const pathMatch = /^(?:https?:\/{2})?(?:www\.)?.*?\.[a-z]\w+\/(?<pathname>.*)/i;
const absolutePath = /^https?/;
const trailingLeadingPathMatch = /^\/|\/$/;
export function routeIsActive({
  activeRoute,
  currentRoute,
}: RouteIsActiveProps) {
  if (!(absolutePath.test(activeRoute) && absolutePath.test(currentRoute))) {
    const activePathname = <{ pathname?: string } | null>(
      pathMatch.exec(activeRoute)?.groups
    );

    const currentPathname = <{ pathname?: string } | null>(
      pathMatch.exec(currentRoute)?.groups
    );

    if (activePathname?.pathname) activeRoute = activePathname.pathname;
    if (currentPathname?.pathname) currentRoute = currentPathname.pathname;
  }

  activeRoute = activeRoute.replace(trailingLeadingPathMatch, '');
  currentRoute = currentRoute.replace(trailingLeadingPathMatch, '');
  return (
    activeRoute === currentRoute ||
    (activeRoute && currentRoute && activeRoute.startsWith(currentRoute))
  );
}

export function jsonAggBuildObject<T extends SelectedFields>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql`coalesce(json_agg(distinct jsonb_build_object(${sql.join(
    chunks
  )})), '[]')`;
}
