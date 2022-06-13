import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product:Product = new Product();
  

  constructor(private productService:ProductService,private activatedRoute: ActivatedRoute,private cartService:CartService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(()=>{
      this.getProductDetails();
    })
    
  }
  getProductDetails() {
    const productId:number = +this.activatedRoute.snapshot.paramMap.get("id");
    this.productService.getProduct(productId).subscribe(data=>{
      this.product = data;
    })
  }

  handleAddToCart(){
    const cartItem:CartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
