package com.kuroko.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.kuroko.ecommerce.entity.Country;
import com.kuroko.ecommerce.entity.Product;
import com.kuroko.ecommerce.entity.ProductCategory;
import com.kuroko.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] unsupportMethod = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};

        disableHttpMethods(Product.class, config, unsupportMethod);
        disableHttpMethods(ProductCategory.class, config, unsupportMethod);
        disableHttpMethods(Country.class, config, unsupportMethod);
        disableHttpMethods(State.class, config, unsupportMethod);
        
        config.exposeIdsFor(Product.class);
        config.exposeIdsFor(ProductCategory.class);
        config.exposeIdsFor(State.class);
        config.exposeIdsFor(Country.class);

    }

    public void disableHttpMethods(Class<?> theClass,RepositoryRestConfiguration config,HttpMethod[] unsupportMethod){
        config.getExposureConfiguration()
            .forDomainType(theClass)
            .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportMethod)))
            .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportMethod)));
    }
}
