const { DB, COLLECTION } = require('./lib');

module.exports.up = async function (next) {
    const db = DB.client.db(); // Get the native MongoDB database instance

    try {
    // Update the schema of the users collection to include the guardianId field with default as null
        await db.collection(COLLECTION.USER).updateMany(
            {},
            {
                $set: {
                    guardianId: null // Set the guardianId to null for all existing users
                }
            }
        );
        console.log('Migration to add guardianId to users completed.');
    } catch (error) {
        console.error('Error in migration to add guardianId to users:', error);
    }

    next();
};

module.exports.down = async function (next) {
    const db = DB.client.db(); // Get the native MongoDB database instance

    try {
    // Remove the guardianId field from all documents
        await db.collection(COLLECTION.USER).updateMany(
            {},
            {
                $unset: {
                    guardianId: ''
                }
            }
        );
        console.log('Migration to remove guardianId from users completed.');
    } catch (error) {
        console.error('Error in migration to remove guardianId from users:', error);
    }

    next();
};
