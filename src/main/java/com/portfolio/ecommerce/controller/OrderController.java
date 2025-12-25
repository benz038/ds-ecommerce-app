package com.portfolio.ecommerce.controller;

import com.portfolio.ecommerce.dto.OrderResponse;
import com.portfolio.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(Authentication authentication) {
        String username = authentication.getName();
        OrderResponse order = orderService.createOrderFromCart(username);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {
        String username = authentication.getName();
        List<OrderResponse> orders = orderService.getUserOrders(username);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        String username = authentication.getName();
        OrderResponse order = orderService.getOrderById(orderId, username);
        return ResponseEntity.ok(order);
    }
}
