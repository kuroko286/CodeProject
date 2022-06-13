package com.kuroko.ecommerce.dao;

import com.kuroko.ecommerce.entity.*;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product,Long>
{
    Page<Product> findByProductCategoryId(@RequestParam("id") Long id,Pageable pageable);
    Page<Product> findByNameContaining(@RequestParam("name") String name,Pageable pageable);
    Optional<Product> findById(@RequestParam("id") Long id);
}
