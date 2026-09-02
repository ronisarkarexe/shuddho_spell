import { type NextRequest, type NextResponse } from 'next/server';
import { FORMAL_INFORMAL_PAGE_SIZE } from '@/components/learning/formal-informal-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { type GetFormalInformalUseCase } from '../../application/use-cases/get-formal-informal';
import {
  formalInformalQuerySchema,
  type FormalInformalQuery,
} from '../dto/formal-informal-requests';

/**
 * `GET /api/v1/library/formal-informal` — a numbered page of pairs.
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
        pageSize: query.pageSize ?? FORMAL_INFORMAL_PAGE_SIZE,
        ...(query.page === undefined ? {} : { page: query.page }),
        ...(query.topic === undefined ? {} : { topic: query.topic }),
        ...(query.startsWith === undefined ? {} : { startsWith: query.startsWith }),
      });
    },
    { querySchema: formalInformalQuerySchema },
  );
}
