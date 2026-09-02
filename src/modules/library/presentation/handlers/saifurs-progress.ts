import { type NextRequest, type NextResponse } from 'next/server';
import { SAIFURS_PAGE_SIZE } from '@/components/learning/saifurs-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type GetSaifursProgressUseCase } from '../../application/use-cases/get-saifurs-progress';
import { type SaveSaifursProgressUseCase } from '../../application/use-cases/save-saifurs-progress';
import {
  saveSaifursProgressBodySchema,
  type SaveSaifursProgressBody,
} from '../dto/saifurs-requests';

function mapProfileError(caught: unknown): never {
  if (caught instanceof ProfileNotFoundError) {
    throw ApiError.notFound('Your learner profile');
  }

  throw caught;
}

/**
 * `GET /api/v1/library/saifurs/progress` — the bookmark.
 */
export function createGetSaifursProgressHandler(
  useCase: () => GetSaifursProgressUseCase,
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
 * `PUT /api/v1/library/saifurs/progress` — I am on this page.
 *
 * The body is only a page number. The serial and the count are computed from
 * the corpus, never taken from the client.
 */
export function createSaveSaifursProgressHandler(
  useCase: () => SaveSaifursProgressUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<SaveSaifursProgressBody>(
    async ({ user, body }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          page: body.page,
          pageSize: SAIFURS_PAGE_SIZE,
        });
      } catch (caught: unknown) {
        mapProfileError(caught);
      }
    },
    {
      bodySchema: saveSaifursProgressBodySchema,
      rateLimit: { key: 'saifurs:progress', limit: 60, windowSeconds: 60 },
    },
  );
}
