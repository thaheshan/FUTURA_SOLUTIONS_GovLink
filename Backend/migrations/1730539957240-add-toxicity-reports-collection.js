const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
    const db = DB.client.db(); // Use the native MongoDB database object

    // Check if the collection already exists
    const collections = await db.listCollections({ name: COLLECTION.TOXICITY_REPORTS }).toArray();
    if (collections.length === 0) {
    // Step 1: Create the 'toxicityReports' collection
        await db.createCollection(COLLECTION.TOXICITY_REPORTS);
    }

    next();
};

module.exports.down = async function (next) {
    const db = DB.client.db();

    // Drop the 'toxicityReports' collection if it exists
    await db.collection(COLLECTION.TOXICITY_REPORTS).drop();

    next();
};
