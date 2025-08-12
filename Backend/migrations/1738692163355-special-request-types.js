const { DB, COLLECTION, SPECIAL_REQUEST_TYPES } = require('./lib');

module.exports.up = async function (next) {
    const db = DB.client.db();

    const collections = await db.listCollections({ name: COLLECTION.SPECIAL_REQUEST_TYPES }).toArray();
    if (collections.length === 0) {
        await db.createCollection(COLLECTION.SPECIAL_REQUEST_TYPES);
        // eslint-disable-next-line no-console
        console.log('Created specialRequestType collection');
    }
    // await db.collection(COLLECTION.SPECIAL_REQUEST_TYPES).insertMany(SPECIAL_REQUEST_TYPES);

    for (const i in SPECIAL_REQUEST_TYPES) {
        const type = SPECIAL_REQUEST_TYPES[i];
        const category = await DB.collection(COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES).findOne({
            code: type.category
        });
        if (category) {
            DB.collection(COLLECTION.SPECIAL_REQUEST_TYPES).insertOne({
                name: type.name, categoryId: category._id, description: type.description, basePrice: 0
            });
        } else {
            // eslint-disable-next-line no-console
            console.log('Special request type category not found:', type.category);
        }
    }
    // eslint-disable-next-line no-console
    console.log('Inserted default special request types');
    next();
};

module.exports.down = async function (next) {
    const db = DB.client.db(); // Use the native MongoDB database object
    await db.collection(COLLECTION.SPECIAL_REQUEST_TYPE_CATEGORIES).drop();
    next();
};
