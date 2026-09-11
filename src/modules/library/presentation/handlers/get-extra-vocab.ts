import { type NextRequest, type NextResponse } from 'next/server';
import { EXTRA_VOCAB_PAGE_SIZE } from '@/components/learning/extra-vocab-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type GetExtraVocabUseCase } from '../../application/use-cases/get-extra-vocab';
import { extraVocabQuerySchema, type ExtraVocabQuery } from '../dto/extra-vocab-requests';

export function createGetExtraVocabHandler(
  useCase: () => GetExtraVocabUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<undefined, ExtraVocabQuery>(
    async ({ user, query }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          pageSize: query.pageSize ?? EXTRA_VOCAB_PAGE_SIZE,
          ...(query.page === undefined ? {} : { page: query.page }),
          ...(query.letter === undefined ? {} : { letter: query.letter }),
          ...(query.partOfSpeech === undefined ? {} : { partOfSpeech: query.partOfSpeech }),
          ...(query.startsWith === undefined ? {} : { startsWith: query.startsWith }),
          ...(query.mark === undefined ? {} : { mark: query.mark }),
        });
      } catch (caught: unknown) {
        if (caught instanceof ProfileNotFoundError) {
          throw ApiError.notFound('Your learner profile');
        }

        throw caught;
      }
    },
    { querySchema: extraVocabQuerySchema },
  );
}
