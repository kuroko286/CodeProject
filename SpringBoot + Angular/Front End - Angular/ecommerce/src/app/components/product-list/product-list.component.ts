import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[];
  currKeyword:string = "";
  prevKeyword:string = "";
  currCategoryId:number = 1;
  prevCategoryId:number = 1;
  searchMode:boolean = false;
  pageSize: number = 5;
  pageNumber: number = 1;
  totalProducts:number;
  

  constructor(private productService:ProductService,private activatedRoute: ActivatedRoute,private cartService:CartService) { }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(()=>{
      this.listProducts();
    })
    
  }

  handleAddToCart(product:Product){
    const cartItem:CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

  updatePageSize(newPageSize:number){
    this.pageSize = newPageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  listProducts() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleCategoryListProducts();
    }
  }
  handleSearchProducts() {
    this.currKeyword = this.activatedRoute.snapshot.paramMap.get('keyword');
    if(this.currKeyword != this.prevKeyword){
      this.pageNumber = 1;
    }
    this.prevKeyword = this.currKeyword;
    this.productService.searchProducts(this.currKeyword,this.pageNumber,this.pageSize).subscribe(data=>{
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalProducts = data.page.totalElements;
    })
  }

  handleCategoryListProducts(){

    const hasCategoryId = this.activatedRoute.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
    }
    else{
      this.currCategoryId = 1;
    }

    if(this.currCategoryId != this.prevCategoryId){
      this.pageNumber = 1;
      
    }
    this.prevCategoryId = this.currCategoryId;

    this.productService.getProductListPagination(this.currCategoryId,this.pageSize,this.pageNumber).subscribe(data=>
      {
        this.products = data._embedded.products;
        this.pageSize = data.page.size;
        this.pageNumber = data.page.number + 1;
        this.totalProducts = data.page.totalElements;
      });
  }
}
