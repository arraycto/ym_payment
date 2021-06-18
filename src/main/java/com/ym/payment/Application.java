package com.ym.payment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Spring Boot 应用启动类
 * @author ymbok.com(ym6745476)
 * @date 2020-06-30 14:38
 */
@SpringBootApplication
@MapperScan("com.ym.payment.dao")
@ComponentScan("com.ym")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
