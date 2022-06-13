package com.kuroko.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseRespone {

    public PurchaseRespone(String genString) {
        this.orderTrackingNumber = genString;
    }

    private String orderTrackingNumber;
}
