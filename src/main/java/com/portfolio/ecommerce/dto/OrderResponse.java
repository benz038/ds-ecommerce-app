package com.portfolio.ecommerce.dto;

import com.portfolio.ecommerce.model.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal totalPrice;
    private Order.OrderStatus status;
    private List<OrderItemResponse> items;
}
