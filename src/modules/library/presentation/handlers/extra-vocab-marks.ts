import { type NextRequest, type NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { ExtraVocabWordNotFoundError } from '../../domain/errors/extra-vocab-word-not-found.error';
import { type SaveExtraVocabMarkUseCase } from '../../application/use-cases/save-extra-vocab-mark';
import {
  saveExtraVocabMarkBodySchema,
  type SaveExtraVocabMarkBody,
} from '../dto/extra-vocab-requests';

function mapError(caught: unknown): never {
  if (caught instanceof ProfileNotFoundError) {
    throw ApiError.notFound('Your learner profile');
  }

  if (caught instanceof ExtraVocabWordNotFoundError) {
    throw ApiError.notFound('That word');
  }

  throw caught;
}

export function createSaveExtraVocabMarkHandler(
  useCase: () => SaveExtraVocabMarkUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<SaveExtraVocabMarkBody>(
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
      bodySchema: saveExtraVocabMarkBodySchema,
      rateLimit: { key: 'extra-vocab:marks', limit: 120, windowSeconds: 60 },
    },
  );
}
