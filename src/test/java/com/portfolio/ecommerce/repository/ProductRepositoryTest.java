package com.portfolio.ecommerce.repository;

import com.portfolio.ecommerce.model.Category;
import com.portfolio.ecommerce.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class ProductRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category category;
    private Product product;

    @BeforeEach
    void setUp() {
        category = Category.builder()
            .name("Electronics")
            .description("Electronic items")
            .active(true)
            .build();
        entityManager.persist(category);

        product = Product.builder()
            .name("Laptop")
            .description("Gaming laptop")
            .price(new BigDecimal("999.99"))
            .stockQuantity(10)
            .sku("LAP-001")
            .active(true)
            .category(category)
            .build();
        entityManager.persist(product);
        entityManager.flush();
    }

    @Test
    void testFindByActiveTrue() {
        List<Product> products = productRepository.findByActiveTrue();

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Laptop");
        assertThat(products.get(0).getActive()).isTrue();
    }

    @Test
    void testFindByCategoryId() {
        List<Product> products = productRepository.findByCategoryId(category.getId());

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getCategory().getName()).isEqualTo("Electronics");
    }

    @Test
    void testFindBySku() {
        Optional<Product> found = productRepository.findBySku("LAP-001");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Laptop");
    }

    @Test
    void testSearchByName() {
        List<Product> products = productRepository.searchByName("lap");

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).containsIgnoringCase("Laptop");
    }

    @Test
    void testExistsBySku() {
        Boolean exists = productRepository.existsBySku("LAP-001");

        assertThat(exists).isTrue();
    }

    @Test
    void testExistsBySku_NotFound() {
        Boolean exists = productRepository.existsBySku("NON-EXISTENT");

        assertThat(exists).isFalse();
    }
}
