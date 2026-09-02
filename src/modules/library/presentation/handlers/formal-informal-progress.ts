import { type NextRequest, type NextResponse } from 'next/server';
import { FORMAL_INFORMAL_PAGE_SIZE } from '@/components/learning/formal-informal-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type GetFormalInformalProgressUseCase } from '../../application/use-cases/get-formal-informal-progress';
import { type SaveFormalInformalProgressUseCase } from '../../application/use-cases/save-formal-informal-progress';
import {
  saveFormalInformalProgressBodySchema,
  type SaveFormalInformalProgressBody,
} from '../dto/formal-informal-requests';

function mapProfileError(caught: unknown): never {
  if (caught instanceof ProfileNotFoundError) {
    throw ApiError.notFound('Your learner profile');
  }

  throw caught;
}

/**
 * `GET /api/v1/library/formal-informal/progress` — the bookmark.
 */
export function createGetFormalInformalProgressHandler(
  useCase: () => GetFormalInformalProgressUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi(async ({ user }) => {
    if (user === null) {
      throw ApiError.unauthenticated();
    }

    try {
      return await useCase().execute({ userId: user.userId });
    } catch (caught: unknown) {
      mapProfileError(caught);
    }
  });
}

/**
 * `PUT /api/v1/library/formal-informal/progress` — I am on this page.
 *
 * The body is only a page number. The serial and the count are computed from
 * the corpus, never taken from the client.
 */
export function createSaveFormalInformalProgressHandler(
  useCase: () => SaveFormalInformalProgressUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<SaveFormalInformalProgressBody>(
    async ({ user, body }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          page: body.page,
          pageSize: FORMAL_INFORMAL_PAGE_SIZE,
        });
      } catch (caught: unknown) {
        mapProfileError(caught);
      }
    },
    {
      bodySchema: saveFormalInformalProgressBodySchema,
      rateLimit: { key: 'formal-informal:progress', limit: 60, windowSeconds: 60 },
    },
  );
}
