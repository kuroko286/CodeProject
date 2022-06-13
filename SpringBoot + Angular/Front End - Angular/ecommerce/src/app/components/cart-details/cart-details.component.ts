import { Component, OnInit } from '@angular/core';
import { data } from 'autoprefixer';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[] = [];
  totalPrice:number;
  totalQuantity:number;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.updateTotalValue();
  }
  updateTotalValue() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(data=>{
      this.totalPrice = data;
    })
    this.cartService.totalQuantity.subscribe(data=>{
      this.totalQuantity = data;
    })
    this.cartService.computeTotalValue();
  }

  handleMinusQuantity(currCartItem:CartItem){
    this.cartService.removeFromCart(currCartItem);
  }

  handlePlusQuantity(currCartItem:CartItem){
    this.cartService.addToCart(currCartItem);
  }

  handleRemoveItem(currCartItem:CartItem){
    this.cartService.deleteItem(currCartItem);
  }

}
