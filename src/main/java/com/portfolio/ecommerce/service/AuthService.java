package com.portfolio.ecommerce.service;

import com.portfolio.ecommerce.dto.SignupRequest;
import com.portfolio.ecommerce.exception.BadRequestException;
import com.portfolio.ecommerce.model.Cart;
import com.portfolio.ecommerce.model.Role;
import com.portfolio.ecommerce.model.User;
import com.portfolio.ecommerce.repository.CartRepository;
import com.portfolio.ecommerce.repository.RoleRepository;
import com.portfolio.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(SignupRequest signupRequest, boolean isAdmin) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user
        User user = User.builder()
            .username(signupRequest.getUsername())
            .email(signupRequest.getEmail())
            .password(passwordEncoder.encode(signupRequest.getPassword()))
            .firstName(signupRequest.getFirstName())
            .lastName(signupRequest.getLastName())
            .active(true)
            .build();

        // Assign roles
        Set<Role> roles = new HashSet<>();
        if (isAdmin) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin Role not found"));
            roles.add(adminRole);
        } else {
            Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User Role not found"));
            roles.add(userRole);
        }
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // Create cart for user
        if (!isAdmin) {
            Cart cart = Cart.builder()
                .user(savedUser)
                .build();
            cartRepository.save(cart);
        }

        log.info("User registered successfully: {}", savedUser.getUsername());
        return savedUser;
    }
}
