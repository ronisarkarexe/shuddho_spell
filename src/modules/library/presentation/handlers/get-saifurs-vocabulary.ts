import { type NextRequest, type NextResponse } from 'next/server';
import { SAIFURS_PAGE_SIZE } from '@/components/learning/saifurs-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { ProfileNotFoundError } from '@/modules/auth/domain/errors/profile-not-found.error';
import { type GetSaifursVocabularyUseCase } from '../../application/use-cases/get-saifurs-vocabulary';
import { saifursQuerySchema, type SaifursQuery } from '../dto/saifurs-requests';

/**
 * `GET /api/v1/library/saifurs` — a numbered page of cards.
 */
export function createGetSaifursVocabularyHandler(
  useCase: () => GetSaifursVocabularyUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<undefined, SaifursQuery>(
    async ({ user, query }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      try {
        return await useCase().execute({
          userId: user.userId,
          pageSize: query.pageSize ?? SAIFURS_PAGE_SIZE,
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
    { querySchema: saifursQuerySchema },
  );
}
