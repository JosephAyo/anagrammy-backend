import { Request } from "express";
import { SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "./data-source";

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

export const usePagination = async (req: Request, dbQuery: SelectQueryBuilder<any>, totalCountQuery: string) => {
  const { paginate, page } = req.query;
  const total = await AppDataSource.query(totalCountQuery);
  const paginationParams: {
    paginate: number;
    page: number;
    total: number;
    pages?: number;
  } = {
    paginate: paginate ? parseInt(paginate as string) : 12,
    page: page ? (parseInt(page as string) <= 0 ? 1 : parseInt(page as string)) : 1,
    total: total.length > 0 ? parseInt(total[0].count) : 0,
  };
  paginationParams.pages = Math.ceil(paginationParams.total / paginationParams.paginate);

  return {
    paginatedQuery: dbQuery.take(paginationParams.paginate).skip((paginationParams.page - 1) * paginationParams.paginate),
    ...paginationParams,
  };
};
