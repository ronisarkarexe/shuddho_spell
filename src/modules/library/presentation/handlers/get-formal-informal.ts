import { type NextRequest, type NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { type GetFormalInformalUseCase } from '../../application/use-cases/get-formal-informal';
import {
  formalInformalQuerySchema,
  type FormalInformalQuery,
} from '../dto/formal-informal-requests';

/** Twenty-four pairs fill a screen without turning the page into a scroll test. */
const DEFAULT_PAGE_SIZE = 24;

/**
 * `GET /api/v1/library/formal-informal` — a page of informal → formal pairs.
 *
 * Authenticated, though nothing it returns is personal — the same line the
 * vocabulary endpoint draws. The pairs themselves, pageable and filterable,
 * are the reference a subscriber signed in for.
 */
export function createGetFormalInformalHandler(
  useCase: () => GetFormalInformalUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<undefined, FormalInformalQuery>(
    async ({ user, query }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      return await useCase().execute({
        pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
        ...(query.topic === undefined ? {} : { topic: query.topic }),
        ...(query.startsWith === undefined ? {} : { startsWith: query.startsWith }),
        ...(query.after === undefined ? {} : { after: query.after }),
      });
    },
    { querySchema: formalInformalQuerySchema },
  );
}
