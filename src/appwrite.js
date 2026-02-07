import { Client, TablesDB, Query, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const db = new TablesDB(client);

// This function takes the searchTerm the user has typed and the first movie associated with that search term as the parameters
export const updateSearchCount = async (searchTerm, movie) => {
  // Check if the search term already exists in the database
  try {
    const results = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    // If it does exist, update the count
    if (results.rows.length > 0) {
      const row = results.rows[0];

      await db.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });

      // If it does not exist create the search term and set the count to 1 in the database
    } else {
      await db.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });
    return result.rows;
  } catch (err) {
    console.error(err);
  }
};
