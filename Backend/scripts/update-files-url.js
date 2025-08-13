/* eslint-disable no-await-in-loop */
import { DB } from '../migrations/lib';

export default async () => {
    const files = await DB.collection('files').find({}).toArray();
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
        if (file.path.includes('fanso-api.xscripts.info')) {
            await DB.collection('files').updateOne(
                { _id: file._id },
                {
                    $set: {
                        path: file.path.replaceAll(
                            'fanso-api.xscripts.info',
                            'api.fanso.xscripts.info'
                        )
                    }
                }
            );
        }
    }
};
