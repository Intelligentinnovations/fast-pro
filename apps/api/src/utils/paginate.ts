import { SelectQueryBuilder } from 'kysely';

import { PaginationResult,QueryParams } from './types';

export async function paginate<T>({
  queryBuilder,
  pagination,
  identifier,
}: {
  identifier: string;
  pagination: QueryParams;
  queryBuilder: SelectQueryBuilder<any, any, any>;
}): Promise<PaginationResult<T>> {
  const { page = 1 } = pagination;
  
  const limit = Math.min(pagination.limit || 10, 20);
  const offset = (page - 1) * limit;

  const dataQuery = queryBuilder.offset(offset).limit(limit);

  const countQuery = queryBuilder
    .clearSelect()
    .clearOrderBy()
    .select((qb) => qb.fn.count(identifier).as('count'));

  console.log('Count query SQL:', countQuery.compile().sql);
  console.log('Data query SQL:', dataQuery.compile().sql);

  const [data, totalResult] = await Promise.all([
    dataQuery.execute(),
    countQuery.executeTakeFirst(),
  ]);

  console.log('Total result:', totalResult);
  
  const total = totalResult ? parseInt(totalResult.count as string, 10) : 0;
  return {
    data,
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  };
}