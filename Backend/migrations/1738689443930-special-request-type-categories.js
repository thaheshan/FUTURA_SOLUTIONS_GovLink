const { DB, COLLECTION, SPECIAL_REQUEST_TYPE_CATEGORIES } = require('./lib');

module.exports.up = async function (next) {
    const db = DB.client.db();

    const collections = await db.listCollections({ name: COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES }).toArray();
    if (collections.length === 0) {
        await db.createCollection(COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES);
        // eslint-disable-next-line no-console
        console.log('Created specialRequestTypeCategories collection');
    }
    await db.collection(COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES).insertMany(SPECIAL_REQUEST_TYPE_CATEGORIES);
    // eslint-disable-next-line no-console
    console.log('Inserted default special request types categories');
    next();
};

module.exports.down = async function (next) {
    const db = DB.client.db(); // Use the native MongoDB database object

    // Drop the 'messageDetectionKeywords' collection
    await db.collection(COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES).drop();
    next();
};
