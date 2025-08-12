import { Injectable } from '@nestjs/common';

import states from 'countrycitystatejson';

@Injectable()
export class StateService {
    constructor() {}

    public getStatesByCountry(code: string) {
        const data = states.getStatesByShort(code);
        return data;
    }
}
