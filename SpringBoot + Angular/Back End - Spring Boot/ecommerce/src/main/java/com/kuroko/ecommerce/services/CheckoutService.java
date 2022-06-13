package com.kuroko.ecommerce.services;

import com.kuroko.ecommerce.dto.Purchase;
import com.kuroko.ecommerce.dto.PurchaseRespone;

public interface CheckoutService {
    PurchaseRespone placeOrder(Purchase purchase);
}
