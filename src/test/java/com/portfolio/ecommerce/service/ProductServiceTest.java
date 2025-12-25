package com.portfolio.ecommerce.service;

import com.portfolio.ecommerce.dto.ProductRequest;
import com.portfolio.ecommerce.dto.ProductResponse;
import com.portfolio.ecommerce.exception.BadRequestException;
import com.portfolio.ecommerce.exception.ResourceNotFoundException;
import com.portfolio.ecommerce.model.Category;
import com.portfolio.ecommerce.model.Product;
import com.portfolio.ecommerce.repository.CategoryRepository;
import com.portfolio.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Category category;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        category = Category.builder()
            .id(1L)
            .name("Electronics")
            .description("Electronic items")
            .active(true)
            .build();

        product = Product.builder()
            .id(1L)
            .name("Laptop")
            .description("Gaming laptop")
            .price(new BigDecimal("999.99"))
            .stockQuantity(10)
            .sku("LAP-001")
            .active(true)
            .category(category)
            .build();

        productRequest = ProductRequest.builder()
            .name("Laptop")
            .description("Gaming laptop")
            .price(new BigDecimal("999.99"))
            .stockQuantity(10)
            .sku("LAP-001")
            .categoryId(1L)
            .active(true)
            .build();
    }

    @Test
    void testGetAllProducts() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(product));

        List<ProductResponse> result = productService.getAllProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Laptop");
        verify(productRepository).findAll();
    }

    @Test
    void testGetActiveProducts() {
        when(productRepository.findByActiveTrue()).thenReturn(Arrays.asList(product));

        List<ProductResponse> result = productService.getActiveProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getActive()).isTrue();
        verify(productRepository).findByActiveTrue();
    }

    @Test
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse result = productService.getProductById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Laptop");
        verify(productRepository).findById(1L);
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Product not found");

        verify(productRepository).findById(1L);
    }

    @Test
    void testCreateProduct_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.existsBySku(anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse result = productService.createProduct(productRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Laptop");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testCreateProduct_DuplicateSku() {
        when(productRepository.existsBySku(anyString())).thenReturn(true);

        assertThatThrownBy(() -> productService.createProduct(productRequest))
            .isInstanceOf(BadRequestException.class)
            .hasMessageContaining("SKU");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testCreateProduct_CategoryNotFound() {
        when(productRepository.existsBySku(anyString())).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.createProduct(productRequest))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Category not found");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testUpdateProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse result = productService.updateProduct(1L, productRequest);

        assertThat(result).isNotNull();
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void testDeleteProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        verify(productRepository).delete(product);
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct(1L))
            .isInstanceOf(ResourceNotFoundException.class);

        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    void testSearchProducts() {
        when(productRepository.searchByName("Laptop")).thenReturn(Arrays.asList(product));

        List<ProductResponse> result = productService.searchProducts("Laptop");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).contains("Laptop");
        verify(productRepository).searchByName("Laptop");
    }
}
