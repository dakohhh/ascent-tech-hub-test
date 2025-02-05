import { FilterQuery, Model, SortOrder } from "mongoose";

export interface IPaginateArgs<T> {
  filter?: FilterQuery<T>;
  sort?: Record<string, SortOrder>;
  projection?: Record<string, 0 | 1>;
}

export interface IPaginationMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface IPaginationResult<T> {
  data: T[];
  meta: IPaginationMeta;
}

export class Paginator<T> {
  private model: Model<T>;
  private page: number;
  private limit: number;
  private args: IPaginateArgs<T>;

  constructor(model: Model<T>, page: number = 1, limit: number = 10, args: IPaginateArgs<T> = { filter: {}, sort: { createdAt: -1 } }) {
    this.model = model;
    this.page = page;
    this.limit = limit;
    this.args = args;
  }

  private getSkip(): number {
    return (this.page - 1) * this.limit;
  }

  async paginate(): Promise<IPaginationResult<T>> {
    const skip = this.getSkip();

    const [items, total] = await Promise.all([
      this.model
        .find(this.args.filter || {})
        .sort(this.args.sort || { createdAt: -1 })
        .skip(skip)
        .limit(this.limit)
        .select(this.args.projection || {}),
      this.model.countDocuments(this.args.filter || {}),
    ]);

    const lastPage = Math.ceil(total / this.limit);
    const currentPage = this.page;

    return {
      data: items,
      meta: {
        total,
        lastPage,
        currentPage,
        perPage: this.limit,
        prev: currentPage > 1 ? currentPage - 1 : null,
        next: currentPage < lastPage ? currentPage + 1 : null,
      },
    };
  }

  setPage(page: number): this {
    this.page = page;
    return this;
  }

  setLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  setArgs(args: IPaginateArgs<T>): this {
    this.args = args;
    return this;
  }
}
