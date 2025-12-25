package com.portfolio.ecommerce.controller;

import com.portfolio.ecommerce.dto.CartItemRequest;
import com.portfolio.ecommerce.dto.CartResponse;
import com.portfolio.ecommerce.security.UserDetailsImpl;
import com.portfolio.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CartController {

    private final CartService cartService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        CartResponse cart = cartService.getCartByUserId(userDetails.getId());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                       @Valid @RequestBody CartItemRequest request) {
        CartResponse cart = cartService.addItemToCart(userDetails.getId(), request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CartResponse> updateCartItem(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                        @PathVariable Long itemId,
                                                        @RequestParam Integer quantity) {
        CartResponse cart = cartService.updateCartItem(userDetails.getId(), itemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CartResponse> removeItemFromCart(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                            @PathVariable Long itemId) {
        CartResponse cart = cartService.removeItemFromCart(userDetails.getId(), itemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
