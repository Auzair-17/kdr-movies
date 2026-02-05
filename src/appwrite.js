import { Client, TablesDB, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const db = new TablesDB(client);

export const updateSearchCount = async (/*searchTerm, movie */) => {
  // Check if the search term already exists in the database
  try {
    const results = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
    });
    // Continue from here.
    console.log(results);
  } catch (err) {
    console.log(err);
  }
  // If it does exist, update the count
  //   If it does not exist create the search term and set the count to 1 in the database
};
