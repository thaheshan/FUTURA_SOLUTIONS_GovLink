const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
    const db = DB.client.db(); // Use the native MongoDB database object

    // Step 1: Create the 'messageDetectionKeywords' collection (only if it doesn't exist)
    const collections = await db.listCollections({ name: COLLECTION.MESSAGE_DETECTION_KEYWORDS }).toArray();
    if (collections.length === 0) {
        await db.createCollection(COLLECTION.MESSAGE_DETECTION_KEYWORDS);
    }

    // Step 2: Insert initial keywords
    await db.collection(COLLECTION.MESSAGE_DETECTION_KEYWORDS).insertMany([
        { keyword: 'nudes' },
        { keyword: 'nude' },
        { keyword: 'keyword3' } // Add more keywords as needed
    ]);

    next();
};

module.exports.down = async function (next) {
    const db = DB.client.db(); // Use the native MongoDB database object

    // Drop the 'messageDetectionKeywords' collection
    await db.collection(COLLECTION.MESSAGE_DETECTION_KEYWORDS).drop();

    next();
};
