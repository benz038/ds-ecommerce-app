package com.portfolio.ecommerce.service;

import com.portfolio.ecommerce.dto.CartItemRequest;
import com.portfolio.ecommerce.dto.CartResponse;
import com.portfolio.ecommerce.exception.BadRequestException;
import com.portfolio.ecommerce.exception.ResourceNotFoundException;
import com.portfolio.ecommerce.model.*;
import com.portfolio.ecommerce.repository.CartItemRepository;
import com.portfolio.ecommerce.repository.CartRepository;
import com.portfolio.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private Product product;
    private CartItem cartItem;
    private CartItemRequest cartItemRequest;

    @BeforeEach
    void setUp() {
        user = User.builder()
            .id(1L)
            .username("testuser")
            .email("test@example.com")
            .build();

        product = Product.builder()
            .id(1L)
            .name("Laptop")
            .price(new BigDecimal("999.99"))
            .stockQuantity(10)
            .active(true)
            .build();

        cart = Cart.builder()
            .id(1L)
            .user(user)
            .items(new ArrayList<>())
            .totalPrice(BigDecimal.ZERO)
            .build();

        cartItem = CartItem.builder()
            .id(1L)
            .cart(cart)
            .product(product)
            .quantity(1)
            .price(product.getPrice())
            .subtotal(product.getPrice())
            .build();

        cartItemRequest = CartItemRequest.builder()
            .productId(1L)
            .quantity(1)
            .build();
    }

    @Test
    void testGetCartByUserId_Success() {
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));

        CartResponse result = cartService.getCartByUserId(1L);

        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo(1L);
        verify(cartRepository).findByUserIdWithItems(1L);
    }

    @Test
    void testGetCartByUserId_NotFound() {
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.getCartByUserId(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Cart not found");

        verify(cartRepository).findByUserIdWithItems(1L);
    }

    @Test
    void testAddItemToCart_Success() {
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse result = cartService.addItemToCart(1L, cartItemRequest);

        assertThat(result).isNotNull();
        verify(cartItemRepository).save(any(CartItem.class));
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void testAddItemToCart_ProductNotFound() {
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItemToCart(1L, cartItemRequest))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Product not found");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void testAddItemToCart_InsufficientStock() {
        product.setStockQuantity(0);
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItemToCart(1L, cartItemRequest))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("Insufficient stock");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void testAddItemToCart_ProductNotActive() {
        product.setActive(false);
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItemToCart(1L, cartItemRequest))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("not available");

        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void testUpdateCartItem_Success() {
        cart.getItems().add(cartItem);
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse result = cartService.updateCartItem(1L, 1L, 2);

        assertThat(result).isNotNull();
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void testRemoveItemFromCart_Success() {
        cart.getItems().add(cartItem);
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartResponse result = cartService.removeItemFromCart(1L, 1L);

        assertThat(result).isNotNull();
        verify(cartItemRepository).delete(cartItem);
    }

    @Test
    void testClearCart_Success() {
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        cartService.clearCart(1L);

        verify(cartItemRepository).deleteByCartId(1L);
        verify(cartRepository).save(any(Cart.class));
    }
}
