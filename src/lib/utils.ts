import { TOKEN_EXPIRES_MIN, TOKEN_RESEND_MIN } from './constant';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import path from 'path';
import { fileURLToPath } from 'url';
import { getInvalidQueryParamsResponse } from './response';
import { ZodError } from 'zod';
import { addMinutes } from 'date-fns';
import {
  Column,
  DrizzleTypeError,
  Equal,
  GetColumnData,
  SQL,
  Table,
  sql,
} from 'drizzle-orm';
import { SelectedFields } from 'drizzle-orm/pg-core';
import { AuthToken } from '@/db/tables/auth-tokens';
import { classifyErrorType } from './validator';

export const createSlug = (value: string) => {
  return value.toLowerCase().split(/\s+/).join('-');
};

export const getImageSlug = (name: string) =>
  name
    .toUpperCase()
    .split(/\s+/)
    .slice(0, 2)
    .map(([firstChar]) => firstChar)
    .join('');
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

export type SelectResultField<
  T,
  TDeep extends boolean = true
> = T extends DrizzleTypeError<any>
  ? T
  : T extends Table
  ? Equal<TDeep, true> extends true
    ? SelectResultField<T['_']['columns'], false>
    : never
  : T extends Column<any>
  ? GetColumnData<T>
  : T extends SQL | SQL.Aliased
  ? T['_']['type']
  : T extends Record<string, any>
  ? SelectResultFields<T, true>
  : never;

export type SelectResultFields<
  TSelectedFields,
  TDeep extends boolean = true
> = {
  [Key in keyof TSelectedFields & string]: SelectResultField<
    TSelectedFields[Key],
    TDeep
  >;
} & {};

export function jsonAggBuildObject<T extends SelectedFields>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql<Array<SelectResultFields<T>>>`coalesce(
      json_agg(
        distinct jsonb_build_object(${sql.join(chunks)})
        ),'[]'::json)`;
}

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
  const chunks: SQL[] = [];

  Object.entries(shape).forEach(([key, value]) => {
    if (chunks.length > 0) {
      chunks.push(sql.raw(`,`));
    }
    chunks.push(sql.raw(`'${key}',`));
    chunks.push(sql`${value}`);
  });

  return sql<SelectResultFields<T>>`json_build_object(${sql.join(chunks)})`;
}

export function getUrlQuery<Query extends Record<string, unknown>>(
  url: string
) {
  return Object.fromEntries(new URL(url).searchParams) as Query;
}
