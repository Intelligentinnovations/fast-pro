import { SelectQueryBuilder } from 'kysely';

import { PaginationParams,PaginationResult } from './types/paginationParams';

export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<any, any, any>,
  pagination: PaginationParams,
): Promise<PaginationResult<T>> {
  const { page = 1, limit = 10 } = pagination;
  const offset = (page - 1) * limit;

  const dataQuery = queryBuilder
    .offset(offset)
    .limit(limit);

  const countQuery = queryBuilder
    .clearSelect()
    .select((qb) =>
      qb.fn.count('id')
        .as('count')
    );

  const [data, totalResult] = await Promise.all([
    dataQuery.execute(),
    countQuery.executeTakeFirst(),
  ]);
  const total = parseInt(totalResult!.count as string, 10);
  return {
    data,
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  };
}

