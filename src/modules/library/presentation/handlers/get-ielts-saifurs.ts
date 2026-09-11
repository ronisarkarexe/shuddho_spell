import { type NextRequest, type NextResponse } from 'next/server';
import { IELTS_SAIFURS_PAGE_SIZE } from '@/components/learning/ielts-saifurs-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { type GetIeltsSaifursUseCase } from '../../application/use-cases/get-ielts-saifurs';
import { ieltsSaifursQuerySchema, type IeltsSaifursQuery } from '../dto/ielts-saifurs-requests';

/**
 * `GET /api/v1/library/ielts-saifurs` — a numbered page of cards.
 */
export function createGetIeltsSaifursHandler(
  useCase: () => GetIeltsSaifursUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<undefined, IeltsSaifursQuery>(
    async ({ user, query }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      return await useCase().execute({
        pageSize: query.pageSize ?? IELTS_SAIFURS_PAGE_SIZE,
        ...(query.page === undefined ? {} : { page: query.page }),
        ...(query.letter === undefined ? {} : { letter: query.letter }),
        ...(query.partOfSpeech === undefined ? {} : { partOfSpeech: query.partOfSpeech }),
        ...(query.startsWith === undefined ? {} : { startsWith: query.startsWith }),
      });
    },
    { querySchema: ieltsSaifursQuerySchema },
  );
}
