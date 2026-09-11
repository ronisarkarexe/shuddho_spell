import { type NextRequest, type NextResponse } from 'next/server';
import { ADJ_VERB_ADV_PAGE_SIZE } from '@/components/learning/adj-verb-adv-contracts';
import { ApiError } from '@/lib/api/problem';
import { withApi } from '@/lib/api/with-api';
import { type GetAdjVerbAdvUseCase } from '../../application/use-cases/get-adj-verb-adv';
import { adjVerbAdvQuerySchema, type AdjVerbAdvQuery } from '../dto/adj-verb-adv-requests';

export function createGetAdjVerbAdvHandler(
  useCase: () => GetAdjVerbAdvUseCase,
): (request: NextRequest) => Promise<NextResponse> {
  return withApi<undefined, AdjVerbAdvQuery>(
    async ({ user, query }) => {
      if (user === null) {
        throw ApiError.unauthenticated();
      }

      return await useCase().execute({
        pageSize: query.pageSize ?? ADJ_VERB_ADV_PAGE_SIZE,
        ...(query.page === undefined ? {} : { page: query.page }),
        ...(query.letter === undefined ? {} : { letter: query.letter }),
        ...(query.partOfSpeech === undefined ? {} : { partOfSpeech: query.partOfSpeech }),
        ...(query.startsWith === undefined ? {} : { startsWith: query.startsWith }),
      });
    },
    { querySchema: adjVerbAdvQuerySchema },
  );
}
