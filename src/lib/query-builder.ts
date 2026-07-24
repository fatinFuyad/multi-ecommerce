import { Document, FilterQuery, Model, QueryWithHelpers } from "mongoose";

type QueryParams = Record<string, string | string[] | undefined>;
type PaginationMeta = {
  page: number;
  limit: number;
  skip: number;
};

type MetaData = PaginationMeta & {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  author: string;
  modelName: string;
  collectionName: string;
};

/**
 * @class QueryBuilder - handles query operation
 * @method build returns the actual query that should be awaited
 */
export class QueryBuilder<T extends Document> {
  public query: QueryWithHelpers<T[], T>;
  public queryParams: QueryParams;
  public queryUrl: string;

  // private readonly model: Model<T>;
  private filterQuery: FilterQuery<T> = {};
  private pagination: PaginationMeta = {
    page: 1,
    limit: 10,
    skip: 0
  };

  /**
   * @constructor
   * @param query - is a mongoose query returned from Model.find() call
   * @param reqUrl - used for filtering, sorting, limiting fields and other stuffs
   */
  constructor(query: QueryWithHelpers<T[], T>, reqUrl: string) {
    const { searchParams } = new URL(reqUrl);
    // this.model = Model;
    this.query = query;
    this.queryParams = Object.fromEntries(searchParams.entries());
    this.queryUrl = reqUrl;
  }

  /**
   * Basic & Advanced Filtering
   */
  filter() {
    const queryObj = { ...this.queryParams };

    const excludedFields = ["sort", "fields", "page", "limit", "search"];

    excludedFields.forEach((field) => delete queryObj[field]);

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in|nin|ne|eq)\b/g,
      (match) => `$${match}`
    );

    const parsedQuery: FilterQuery<T> = JSON.parse(queryString);
    this.query = this.query.find(parsedQuery);

    return this;
  }

  /**
   * Sorting
   * ?sort=price,-createdAt,name
   */
  sort() {
    if (this.queryParams.sort) {
      const sortBy = Array.isArray(this.queryParams.sort)
        ? this.queryParams.sort.join(" ")
        : this.queryParams.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  /**
   * Limit fields
   * ?fields=name,price,category
   */
  limitFields() {
    if (this.queryParams.fields) {
      const fields = Array.isArray(this.queryParams.fields)
        ? this.queryParams.fields.join(" ")
        : this.queryParams.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    }

    return this;
  }

  /**
   * Pagination
   * ?page=2&limit=20
   */
  paginate() {
    const page = Math.max(Number(this.queryParams.page) || 1, 1);
    const limit = Math.max(Number(this.queryParams.limit) || 10, 1);

    const skip = (page - 1) * limit;

    this.pagination = {
      page,
      limit,
      skip
    };

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  /**
   * Text Search
   */
  search(fields: (keyof T)[]) {
    const keyword = this.queryParams.search;

    if (!keyword || Array.isArray(keyword)) {
      return this;
    }

    this.query = this.query.find({
      $or: fields.map((field) => ({
        [field]: {
          $regex: keyword,
          $options: "i"
        }
      }))
    } as FilterQuery<T>);

    return this;
  }

  build() {
    return this.query;
  }

  async exec(model: Model<T>) {
    const collName = model.collection.collectionName;
    const [data, total] = await Promise.all([
      this.query.exec(),
      model.countDocuments(this.filterQuery)
    ]);

    // const total = results[1];
    return {
      metadata: {
        page: this.pagination.page,
        limit: this.pagination.limit,
        skip: this.pagination.skip,
        total,
        totalPages: Math.ceil(total / this.pagination.limit),
        hasNextPage: this.pagination.page < Math.ceil(total / this.pagination.limit),
        hasPrevPage: this.pagination.page > 1,
        author: "fuyad",
        modelName: model.modelName,
        collectionName: model.collection.collectionName
      } satisfies MetaData,
      [`${collName}`]: data
    };
  }
}

/*
handles queries like filtering, sorting, limiting fields, paginations, search (text)
GET /api/products?
category=phone&
price[gte]=1000&
price[lte]=5000&
brand=apple&
search=iphone&
sort=-rating,price&
fields=name,price,rating&
page=2&
limit=10
 */

/*

Suggested Improvements for Production

For a production-grade API, you can extend this class with:

Validation: Validate query parameters (e.g. page >= 1, allowed sort fields).
Whitelisting: Restrict filterable, sortable, and selectable fields to prevent querying sensitive fields.
Nested field support: Allow queries like category.name=Phones.
Populate support: Add a populate() method for relations.
Cursor-based pagination: Better performance than offset pagination on very large collections.
Total count metadata: Return total, totalPages, currentPage, and hasNextPage alongside results.
Aggregation compatibility: Provide a similar builder for aggregation pipelines if your API relies on aggregate() instead of find().

This pattern keeps route handlers concise while centralizing query logic in a reusable, type-safe class.

*/

/*
{
  "success": true,
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 143,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": true
  },
  "data": [
    ...
  ]
}
 */
/*
// USAGE OF THIS QUERYBUILDER CLASS

import Product from "@/models/product";
import { QueryBuilder } from "@/lib/query-builder";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = new QueryBuilder(
    Product.find(),
    Object.fromEntries(searchParams.entries())
  );

  const products = await query
    .filter()
    .search(["name", "brand"])
    .sort()
    .limitFields()
    .paginate()
    .build();

  return Response.json(products);
}
 */
