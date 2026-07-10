import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { queries } from "../db/schema";

const createQuery = async (queryStr: string, userId: string) => {
  try {
    const [data] = await db
      .insert(queries)
      .values({
        clerkUserId: userId,
        query: queryStr,
      })
      .returning();

    return data;
  } catch (error) {
    console.error("Error creating query in database: ", error);
    throw error;
  }
};

const getQueries = async (userId: string) => {
  try {
    const [data] = await db
      .select()
      .from(queries)
      .where(eq(queries.clerkUserId, userId));

    return data;
  } catch (error) {
    console.error("Error fetching queries from database: ", error);
    throw error;
  }
};

const updateQuery = async (
  queryId: string,
  userId: string,
  status: boolean,
) => {
  try {
    const [data] = await db
      .update(queries)
      .set({
        active: status,
      })
      .where(and(eq(queries.id, queryId), eq(queries.clerkUserId, userId)))
      .returning();

    return data;
  } catch (error) {
    console.error("Error updating query in database: ", error);
    throw error;
  }
};

const deleteQuery = async (queryId: string, userId: string) => {
  try {
    const [data] = await db
      .delete(queries)
      .where(and(eq(queries.id, queryId), eq(queries.clerkUserId, userId)))
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
