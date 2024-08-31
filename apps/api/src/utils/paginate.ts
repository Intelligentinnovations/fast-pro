import { SelectQueryBuilder } from 'kysely';

import { PaginationResult, QueryParams } from './types/queryParams';

export async function paginate<T>({
  queryBuilder,
  pagination,
  identifier,
}: {
  identifier: string;
  pagination: QueryParams;
  queryBuilder: SelectQueryBuilder<any, any, any>;
}): Promise<PaginationResult<T>> {
  const { page = 1, limit = 10 } = pagination;
  const offset = (page - 1) * limit;

  const dataQuery = queryBuilder.offset(offset).limit(limit);

  const countQuery = queryBuilder
    .clearSelect()
    .select((qb) => qb.fn.count(identifier).as('count'));

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
