import { render as MustacheRender } from 'mustache';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const VIEW_DIR = join(__dirname, '..', '..', '..', 'views'); // todo - get frm config

export const renderFile = (view, options?: any, cb?: any) => {
    let callback = cb;
    let actualOptions = options;

    if (typeof options === 'function') {
        callback = options;
        actualOptions = {};
    }

    if (typeof callback !== 'function') {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback = () => {};
    }

    const viewDir = actualOptions.viewDir || VIEW_DIR;
    const file = existsSync(view) ? view : join(viewDir, view);
    const content = readFileSync(file, 'utf8');
    callback(null, MustacheRender(content, actualOptions));
};
