package com.kuroko.ecommerce.dto;

import java.util.Set;

import com.kuroko.ecommerce.entity.Address;
import com.kuroko.ecommerce.entity.Customer;
import com.kuroko.ecommerce.entity.Order;
import com.kuroko.ecommerce.entity.OrderItem;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Purchase {
    
    private Customer customer;
    private Address billingAddress;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;



}
