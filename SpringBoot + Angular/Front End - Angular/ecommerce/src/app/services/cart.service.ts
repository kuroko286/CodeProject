import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[] = [];

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(cartItem: CartItem) {
    let isItemExist:boolean = false;
    let existItem:CartItem = undefined;
    
    if(this.cartItems.length > 0){
      existItem = this.cartItems.find(tempItem=>
        tempItem.id === cartItem.id
      )
  
      isItemExist = (existItem != undefined);
    }

    if(isItemExist){
      existItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }

    this.computeTotalValue();
  }
  computeTotalValue() {
    let totalPriceValue:number = 0;
    let totalQuantityValue:number = 0;

    for(let currCartItem of this.cartItems){
      totalPriceValue+=currCartItem.unitPrice * currCartItem.quantity;
      totalQuantityValue+=currCartItem.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
  removeFromCart(currCartItem: CartItem) {
    let existItem = this.cartItems.find(tempItem=>
      tempItem.id === currCartItem.id
    )
    existItem.quantity--;

    if(existItem.quantity === 0){
      this.deleteItem(currCartItem);
    }
    this.computeTotalValue();
  }

  deleteItem(currCartItem:CartItem) {
    let index:number = this.cartItems.findIndex(item=>item.id === currCartItem.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
    this.computeTotalValue();
  }
}
