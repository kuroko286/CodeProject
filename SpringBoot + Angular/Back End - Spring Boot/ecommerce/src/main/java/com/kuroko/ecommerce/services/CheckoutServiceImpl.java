package com.kuroko.ecommerce.services;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.kuroko.ecommerce.dao.CustomerRepository;
import com.kuroko.ecommerce.dto.Purchase;
import com.kuroko.ecommerce.dto.PurchaseRespone;
import com.kuroko.ecommerce.entity.Customer;
import com.kuroko.ecommerce.entity.Order;
import com.kuroko.ecommerce.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseRespone placeOrder(Purchase purchase) {
        
        Order order = purchase.getOrder();
        String genString = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(genString);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.addItem(item));
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        Customer customer = purchase.getCustomer();
        customer.addOrder(order);

        customerRepository.save(customer);

        return new PurchaseRespone(genString);
    }

    public String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
    
}
