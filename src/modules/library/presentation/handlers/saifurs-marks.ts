import { type NextRequest, type NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { SaifursWordNotFoundError } from '../../domain/errors/saifurs-word-not-found.error';
import { type SaveSaifursMarkUseCase } from '../../application/use-cases/save-saifurs-mark';
import { saveSaifursMarkBodySchema, type SaveSaifursMarkBody } from '../dto/saifurs-requests';

function mapError(caught: unknown): never {
  if (caught instanceof ProfileNotFoundError) {
    throw ApiError.notFound('Your learner profile');
  }

  if (caught instanceof SaifursWordNotFoundError) {
    throw ApiError.notFound('That word');
  }

  throw caught;
}

/**
 * `PUT /api/v1/library/saifurs/marks` — I am learning this card, I know it,
 * or I am clearing the mark. The word is checked against the corpus; a
 * string that is not a headword is rejected rather than stored.
 */
export function createSaveSaifursMarkHandler(
  useCase: () => SaveSaifursMarkUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<SaveSaifursMarkBody>(
    async ({ user, body }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          word: body.word,
          status: body.status,
        });
      } catch (caught: unknown) {
        mapError(caught);
      }
    },
    {
      bodySchema: saveSaifursMarkBodySchema,
      rateLimit: { key: 'saifurs:marks', limit: 120, windowSeconds: 60 },
    },
  );
}
