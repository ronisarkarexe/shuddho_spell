import { type NextRequest, type NextResponse } from 'next/server';
import { EXTRA_VOCAB_PAGE_SIZE } from '@/components/learning/extra-vocab-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type GetExtraVocabProgressUseCase } from '../../application/use-cases/get-extra-vocab-progress';
import { type SaveExtraVocabProgressUseCase } from '../../application/use-cases/save-extra-vocab-progress';
import {
  saveExtraVocabProgressBodySchema,
  type SaveExtraVocabProgressBody,
} from '../dto/extra-vocab-requests';

function mapProfileError(caught: unknown): never {
  if (caught instanceof ProfileNotFoundError) {
    throw ApiError.notFound('Your learner profile');
  }

  throw caught;
}

export function createGetExtraVocabProgressHandler(
  useCase: () => GetExtraVocabProgressUseCase,
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

export function createSaveExtraVocabProgressHandler(
  useCase: () => SaveExtraVocabProgressUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<SaveExtraVocabProgressBody>(
    async ({ user, body }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          page: body.page,
          pageSize: EXTRA_VOCAB_PAGE_SIZE,
        });
      } catch (caught: unknown) {
        mapProfileError(caught);
      }
    },
    {
      bodySchema: saveExtraVocabProgressBodySchema,
      rateLimit: { key: 'extra-vocab:progress', limit: 60, windowSeconds: 60 },
    },
  );
}
