import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidator } from 'src/app/validators/shop-validator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
   
  checkoutFormGroup: FormGroup;
  totalQuantity:number = 0;
  totalPrice:number = 0;
  creditCardMonths:number[] = [];
  creditCardYears:number[] = [];
  countries:Country[] = [];
  shippingStates:State[] = [];
  billingStates:State[]  =[];

  constructor(private formBuilder:FormBuilder,
    private shopFormService:ShopFormService,
    private cartService:CartService,
    private checkoutService:CheckoutService,
    private router:Router) { }

  ngOnInit(): void {

    this.reviewTotalPrice();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        email: new FormControl('',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
      }),
      shippingAddress: this.formBuilder.group({
        country:new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        state:[''],
        zipCode:new FormControl('',[Validators.required,Validators.pattern("^[0-9]{6}$")])
      }),
      billingAddress: this.formBuilder.group({
        country:new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        city:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        state:[''],
        zipCode:new FormControl('',[Validators.required,Validators.pattern("^[0-9]{6,6}$")])
      }),
      creditCard: this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        cardName: new FormControl('',[Validators.required,Validators.minLength(2),ShopValidator.notOnlyWhiteSpace]),
        cardNumber:new FormControl('',[Validators.required,Validators.pattern("^[0-9]{16}$")]),
        securityCode:new FormControl('',[Validators.required,Validators.pattern("^[0-9]{6}$")]),
        expirationMonth:[''],
        expirationYear:['']
      })
    })

    let startMonth = new Date().getMonth();
    this.shopFormService.getCreditCardMonths(startMonth + 1).subscribe(data=>
      this.creditCardMonths = data
    )
    this.shopFormService.getCreditCardYears().subscribe(data=>
      this.creditCardYears = data
    )

    this.shopFormService.getCountries().subscribe(data=>this.countries = data);
    
  }
  reviewTotalPrice() {
    this.cartService.totalPrice.subscribe(data=>this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data=>this.totalQuantity = data);
  }
  onSubmit(){
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order:Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    let orderItems = this.cartService.cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase:Purchase = new Purchase();

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState:State = JSON.parse(JSON.stringify(this.checkoutFormGroup.controls['shippingAddress'].value.state));
    const shippingCountry:Country = JSON.parse(JSON.stringify(this.checkoutFormGroup.controls['shippingAddress'].value.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState:State = JSON.parse(JSON.stringify(this.checkoutFormGroup.controls['billingAddress'].value.state));
    const billingCountry:Country = JSON.parse(JSON.stringify(this.checkoutFormGroup.controls['billingAddress'].value.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe({
      next:response=>{
        alert(`Your order have been received!
        Order tracking number ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: error=>alert(`There was an error ${error.massage}`)
      
    })
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }

  //getter - customer property
  get firstName(){return this.checkoutFormGroup.get('customer.firstName')};
  get lastName(){return this.checkoutFormGroup.get('customer.lastName')};
  get email(){return this.checkoutFormGroup.get('customer.email')};

  //getter - shipping address property
  get countryShip(){return this.checkoutFormGroup.get('shippingAddress.country')};
  get cityShip(){return this.checkoutFormGroup.get('shippingAddress.city')};
  get zipCodeShip(){return this.checkoutFormGroup.get('shippingAddress.zipCode')};
  get stateShip(){return this.checkoutFormGroup.get('shippingAddress.state')};
  get streetShip(){return this.checkoutFormGroup.get('shippingAddress.street')};

  //getter - billing address property
  get countryBill(){return this.checkoutFormGroup.get('billingAddress.country')};
  get cityBill(){return this.checkoutFormGroup.get('billingAddress.city')};
  get zipCodeBill(){return this.checkoutFormGroup.get('billingAddress.zipCode')};
  get stateBill(){return this.checkoutFormGroup.get('billingAddress.state')};
  get streetBill(){return this.checkoutFormGroup.get('billingAddress.street')};

  //getter - credit card property
  get cardType(){return this.checkoutFormGroup.get('creditCard.cardType')};
  get cardName(){return this.checkoutFormGroup.get('creditCard.cardName')};
  get cardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber')};
  get securityCode(){return this.checkoutFormGroup.get('creditCard.securityCode')};
  get expirationMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth')};
  get expirationYear(){return this.checkoutFormGroup.get('creditCard.expirationYear')};

  copyData(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingStates = this.shippingStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }

  updateMonthAndYear(){
    const selectedYear:number = Number(this.checkoutFormGroup.get('creditCard').value.expirationYear);
    const currYear:number = new Date().getFullYear();
    let startMonth:number;
    if(selectedYear == currYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      this.creditCardMonths = data;
    })
  }

  getStates(formGroupName:string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    if(formGroupName === 'billingAddress'){
      this.shopFormService.getStates(countryCode).subscribe(data=>this.billingStates = data);
    }
    else if(formGroupName === 'shippingAddress'){
      this.shopFormService.getStates(countryCode).subscribe(data=>this.shippingStates = data);
    }
    
  }
  
}
