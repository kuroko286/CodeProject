import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  

  private countryUrl:string = "http://localhost:8080/api/countries";
  private stateUrl:string = "http://localhost:8080/api/states";

  constructor(private httpClient:HttpClient) { }

  getCreditCardMonths(startMonth:number):Observable<number[]>{
    const months:number[] = [];
    for(let month = startMonth;month<=12;month++){
      months.push(month);
    }
    return of(months);
  }

  getCreditCardYears():Observable<number[]>{
    const years = [];
    let startYear = new Date().getFullYear();
    for(let year = startYear;year<=startYear + 10;year++){
      years.push(year);
    }
    return of(years);
  }

  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetRespondCountry>(this.countryUrl).pipe(map(respond=>respond._embedded.countries));
  }

  getStates(selectedCountryCode: string):Observable<State[]> {
    return this.httpClient.get<GetRespondState>(`${this.stateUrl}/search/findByCountryCode?code=${selectedCountryCode}`)
    .pipe(map(respond=>respond._embedded.states));
  }
}

interface GetRespondCountry{
  _embedded:{
    countries:Country[]
  }
}


interface GetRespondState{
  _embedded:{
    states:State[]
  }
}



