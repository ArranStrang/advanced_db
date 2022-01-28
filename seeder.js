
const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI } = process.env;


/**
 * constants
 */
const client = new MongoClient(MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("books").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      console.info("deleting collection");
      await db.collection("books").drop();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your books 📚 📚 ").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "mybookcollection.json"), "utf8");
    await db.collection("books").insertMany(JSON.parse(data));


    const bookCollectionRef = await db.collection("books").aggregate([
      { $match: { title: { $ne: null } } },
      {
        $group: {
         _id: "$id",
         title: "$title",
         author: "$author" ,
         genre: "$genre",
         release: "$release",
         total_tastings: { $sum: 1 }
        },
      },
      {
          $project: {
            books: "$total_books", 
          },
        },
        { $set: { name: "$_id", _id: "$total_books" } },
      ]);
      
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */

    const bookCollection = await bookCollectionRef.toArray();
    await db.collection("books").insertMany(bookCollection);
     /** Our final data manipulation is to reference each document in the
     * tastings collection to a taster id
     */

      const updatedbookCollectionRef = db.collection("books2").find({});
      const updatedbookCollection = await updatedbookCollectionRef.toArray();
      updatedWineTasters.forEach(async ({ _id, name }) => {
        await db
          .collection("books")
          .updateMany({ book_name: name }, [
            { $set: { book_id: _id },
            }]);
       

        load.stop();
        console.info(`Book collection set up! 📚 📚`);
        process.exit();
  });


 } catch (error) {
    console.error("error:", error);
    process.exit();
  }

}
main();
