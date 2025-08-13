import { Injectable } from '@nestjs/common';
import cities from 'countrycitystatejson';

@Injectable()
export class CityService {
  constructor() {}


  public getCitiesInState(countryCode: string, state: string) {
    const data = cities.getCities(countryCode, state);
    return data;
  }
}
