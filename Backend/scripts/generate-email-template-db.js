import { up } from '../migrations/1619073846178-email-template';

export default async () => {
    await new Promise((resolve) => {
        up(resolve);
    });
};
