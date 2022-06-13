package com.kuroko.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kuroko.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer,Long>{
    
}
