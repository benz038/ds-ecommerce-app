package com.portfolio.ecommerce.service;

import com.portfolio.ecommerce.dto.CartItemRequest;
import com.portfolio.ecommerce.dto.CartItemResponse;
import com.portfolio.ecommerce.dto.CartResponse;
import com.portfolio.ecommerce.exception.BadRequestException;
import com.portfolio.ecommerce.exception.ResourceNotFoundException;
import com.portfolio.ecommerce.model.Cart;
import com.portfolio.ecommerce.model.CartItem;
import com.portfolio.ecommerce.model.Product;
import com.portfolio.ecommerce.repository.CartItemRepository;
import com.portfolio.ecommerce.repository.CartRepository;
import com.portfolio.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (!product.getActive()) {
            throw new BadRequestException("Product is not available");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
            }
            
            item.setQuantity(newQuantity);
            item.calculateSubtotal();
            cartItemRepository.save(item);
        } else {
            CartItem cartItem = CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .price(product.getPrice())
                .build();
            cartItem.calculateSubtotal();
            cart.addItem(cartItem);
            cartItemRepository.save(cartItem);
        }

        cart.calculateTotalPrice();
        cartRepository.save(cart);

        log.info("Item added to cart for user id: {}", userId);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to this user's cart");
        }

        Product product = cartItem.getProduct();
        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        cartItem.setQuantity(quantity);
        cartItem.calculateSubtotal();
        cartItemRepository.save(cartItem);

        cart.calculateTotalPrice();
        cartRepository.save(cart);

        log.info("Cart item updated for user id: {}", userId);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to this user's cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotalPrice();
        cartRepository.save(cart);

        log.info("Item removed from cart for user id: {}", userId);
        return mapToResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId));

        cart.getItems().clear();
        cart.calculateTotalPrice();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);

        log.info("Cart cleared for user id: {}", userId);
    }

    private CartResponse mapToResponse(Cart cart) {
        return CartResponse.builder()
            .id(cart.getId())
            .userId(cart.getUser().getId())
            .items(cart.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()))
            .totalPrice(cart.getTotalPrice())
            .totalItems(cart.getItems().size())
            .build();
    }

    private CartItemResponse mapItemToResponse(CartItem item) {
        return CartItemResponse.builder()
            .id(item.getId())
            .productId(item.getProduct().getId())
            .productName(item.getProduct().getName())
            .productImageUrl(item.getProduct().getImageUrl())
            .price(item.getPrice())
            .quantity(item.getQuantity())
            .subtotal(item.getSubtotal())
            .build();
    }
}
