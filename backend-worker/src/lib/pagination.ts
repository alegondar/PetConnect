import type { SupabaseClient } from "@supabase/supabase-js";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export async function paginate<T>(
  supabase: SupabaseClient,
  tableName: string,
  query: {
    select?: string;
    eq?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    page: number;
    limit: number;
  }
): Promise<PaginatedResponse<T>> {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let builder = supabase.from(tableName).select(query.select ?? "*", {
    count: "exact",
    head: false,
  });

  if (query.eq) {
    for (const [key, value] of Object.entries(query.eq)) {
      builder = builder.eq(key, value);
    }
  }

  if (query.order) {
    builder = builder.order(query.order.column, {
      ascending: query.order.ascending ?? false,
    });
  }

  const { data, count, error } = await builder.range(from, to);

  if (error) throw error;

  return {
    items: (data as T[]) ?? [],
    total: count ?? 0,
    page: query.page,
    pages: Math.ceil((count ?? 0) / query.limit),
  };
}
