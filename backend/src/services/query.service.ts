import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { queries } from "../db/schema";

const createQuery = async (queryStr: string,) => {
  try {
    const [data] = await db
      .insert(queries)
      .values({
        query: queryStr,
      })
      .returning();

    return data;
  } catch (error) {
    console.error("Error creating query in database: ", error);
    throw error;
  }
};

const getQueries = async () => {
  try {
    const data = await db
      .select()
      .from(queries)

    return data;
  } catch (error) {
    console.error("Error fetching queries from database: ", error);
    throw error;
  }
};

const updateQuery = async (
  queryId: string,
  
  status: boolean,
) => {
  try {
    const [data] = await db
      .update(queries)
      .set({
        active: status,
      })
      .where(eq(queries.id, queryId))
      .returning();

    return data;
  } catch (error) {
    console.error("Error updating query in database: ", error);
    throw error;
  }
};

const deleteQuery = async (queryId: string, ) => {
  try {
    const [data] = await db
      .delete(queries)
      .where(eq(queries.id, queryId))
      .returning();

    return data;
  } catch (error) {
    console.error("Error deleting query in database: ", error);
    throw error;
  }
};

export const queryService = {
  createQuery,
  getQueries,
  updateQuery,
  deleteQuery,
};
