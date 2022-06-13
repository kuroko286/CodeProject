import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products";
  private productCategoryUrl = "http://localhost:8080/api/product-category";
  

  constructor(private httpClient:HttpClient) { }

  getProductListPagination(currCategoryId: number, pageSize: number, pageNumber: number):Observable<GetResponseProducts> {
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}/search/findByProductCategoryId?id=${currCategoryId}`
    +`&page=${pageNumber-1}&size=${pageSize}`)
  }

  getProductList(currCategoryId:number):Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(
      `${this.baseUrl}/search/findByProductCategoryId?id=${currCategoryId}`).pipe(map(response=>response._embedded.products));
  }
  
  getProductCategory():Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.productCategoryUrl).pipe(map(response=>response._embedded.productCategory));
  }
  searchProducts(keyword: string,pageNumber:number,pageSize:number):Observable<GetResponseProducts>  {
    return this.httpClient.get<GetResponseProducts>(`${this.baseUrl}/search/findByNameContaining?name=${keyword}`
    +`&page=${pageNumber-1}&size=${pageSize}`);
  }

  getProduct(productId:number):Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${productId}`);
  }

}
interface GetResponseProducts{
  _embedded:{
    products:Product[];
  },
  page:{
  "size": number,
  "totalElements": number,
  "totalPages": number,
  "number": number
  }
}
interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}