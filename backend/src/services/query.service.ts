import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { queries } from "../db/schema";

const createQuery = async (queryStr: string,) => {
 
    const [data] = await db
      .insert(queries)
      .values({
        query: queryStr,
      })
      .returning();

    return data;
 
};

const getQueries = async () => {
  
    const data = await db
      .select()
      .from(queries)

    return data;
 
};

const updateQuery = async (
  queryId: string,
  
  status: boolean,
) => {

    const [data] = await db
      .update(queries)
      .set({
        active: status,
      })
      .where(eq(queries.id, queryId))
      .returning();

    return data;

};

const deleteQuery = async (queryId: string, ) => {
 
    const [data] = await db
      .delete(queries)
      .where(eq(queries.id, queryId))
      .returning();

    return data;
 
};

export const queryService = {
  createQuery,
  getQueries,
  updateQuery,
  deleteQuery,
};
