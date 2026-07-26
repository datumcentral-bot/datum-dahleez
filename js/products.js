/**
 * Datum Dahleez Store - Product Database
 * Professional product catalog management with search and filtering
 */

class ProductDatabase {
    constructor() {
        this.products = this.loadProducts();
        this.currentCategory = 'all';
        this.currentSort = 'name';
        this.init();
    }

    init() {
        this.renderProducts();
        this.attachEventListeners();
    }

    loadProducts() {
        // Comprehensive interior design product catalog
        return [
            // Flooring
            {
                id: 'floor-001',
                name: 'Premium Oak Wood Flooring',
                category: 'flooring',
                price: 89.99,
                unit: 'sq.m',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
                description: 'Premium oak wood flooring with natural finish. Perfect for residential and commercial spaces.',
                inStock: true,
                featured: true,
                tags: ['wood', 'flooring', 'oak', 'premium']
            },
            {
                id: 'floor-002',
                name: 'Marble Tile Collection',
                category: 'flooring',
                price: 129.99,
                unit: 'sq.m',
                image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
                description: 'Luxury marble tiles for elegant interiors. Available in multiple patterns.',
                inStock: true,
                featured: true,
                tags: ['marble', 'tile', 'luxury', 'flooring']
            },
            {
                id: 'floor-003',
                name: 'Carpet Tiles - Commercial Grade',
                category: 'flooring',
                price: 45.99,
                unit: 'sq.m',
                image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
                description: 'Commercial grade carpet tiles for offices and co-working spaces.',
                inStock: true,
                featured: false,
                tags: ['carpet', 'commercial', 'office', 'flooring']
            },

            // Lighting
            {
                id: 'light-001',
                name: 'LED Pendant Lights - Modern',
                category: 'lighting',
                price: 249.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400',
                description: 'Modern LED pendant lights with adjustable brightness.',
                inStock: true,
                featured: true,
                tags: ['LED', 'pendant', 'modern', 'lighting']
            },
            {
                id: 'light-002',
                name: 'Chandelier - Crystal Series',
                category: 'lighting',
                price: 899.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1543198126-a8ad7e200a40?w=400',
                description: 'Elegant crystal chandelier for luxury interiors.',
                inStock: true,
                featured: true,
                tags: ['chandelier', 'crystal', 'luxury', 'lighting']
            },
            {
                id: 'light-003',
                name: 'Smart LED Strip Lights',
                category: 'lighting',
                price: 79.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400',
                description: 'Smart LED strip lights with app control and color changing.',
                inStock: true,
                featured: false,
                tags: ['LED', 'smart', 'strip', 'lighting']
            },

            // Furniture
            {
                id: 'furn-001',
                name: 'Ergonomic Office Chair',
                category: 'furniture',
                price: 599.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ce8?w=400',
                description: 'Premium ergonomic office chair with lumbar support.',
                inStock: true,
                featured: true,
                tags: ['office', 'chair', 'ergonomic', 'furniture']
            },
            {
                id: 'furn-002',
                name: 'Modern Sofa Set',
                category: 'furniture',
                price: 1299.99,
                unit: 'set',
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
                description: 'Modern 3-seater sofa set with premium fabric.',
                inStock: true,
                featured: true,
                tags: ['sofa', 'modern', 'living', 'furniture']
            },
            {
                id: 'furn-003',
                name: 'Standing Desk - Electric',
                category: 'furniture',
                price: 449.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400',
                description: 'Electric standing desk with memory settings.',
                inStock: true,
                featured: false,
                tags: ['desk', 'standing', 'office', 'furniture']
            },

            // Decor
            {
                id: 'decor-001',
                name: 'Wall Art - Abstract Collection',
                category: 'decor',
                price: 149.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
                description: 'Abstract wall art collection for modern interiors.',
                inStock: true,
                featured: true,
                tags: ['wall', 'art', 'abstract', 'decor']
            },
            {
                id: 'decor-002',
                name: 'Indoor Plant Set',
                category: 'decor',
                price: 89.99,
                unit: 'set',
                image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
                description: 'Set of 5 indoor plants with decorative pots.',
                inStock: true,
                featured: false,
                tags: ['plants', 'indoor', 'green', 'decor']
            },

            // Materials
            {
                id: 'material-001',
                name: 'Premium Paint - Interior',
                category: 'materials',
                price: 59.99,
                unit: 'liter',
                image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
                description: 'Premium interior paint with anti-bacterial formula.',
                inStock: true,
                featured: true,
                tags: ['paint', 'interior', 'premium', 'materials']
            },

            // Podcast Studio
            {
                id: 'podcast-001',
                name: 'Podcast Studio Desk',
                category: 'podcast',
                price: 899.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
                description: 'Professional podcast studio desk with cable management.',
                inStock: true,
                featured: true,
                tags: ['podcast', 'desk', 'studio', 'professional']
            },
            {
                id: 'podcast-002',
                name: 'Acoustic Panels Set',
                category: 'podcast',
                price: 199.99,
                unit: 'set',
                image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400',
                description: 'Professional acoustic panels for soundproofing.',
                inStock: true,
                featured: false,
                tags: ['acoustic', 'panels', 'soundproof', 'podcast']
            },

            // Branding & Signage
            {
                id: 'brand-001',
                name: 'Custom Vinyl Signage',
                category: 'branding',
                price: 149.99,
                unit: 'piece',
                image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400',
                description: 'Custom vinyl signage for business branding.',
                inStock: true,
                featured: true,
                tags: ['vinyl', 'signage', 'branding', 'custom']
            }
        ];
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getProductsByCategory(category) {
        if (category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    }

    getFeaturedProducts() {
        return this.products.filter(p => p.featured);
    }

    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    getCategories() {
        const categories = [...new Set(this.products.map(p => p.category))];
        return categories;
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    renderProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        const products = this.sortProducts(
            this.getProductsByCategory(this.currentCategory),
            this.currentSort
        );

        productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    ${!product.inStock ? '<span class="out-of-stock">Out of Stock</span>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category}</span>
                        <span class="product-unit">per ${product.unit}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" 
                                data-product-id="${product.id}" 
                                data-product-name="${product.name}" 
                                data-product-price="${product.price}"
                                data-product-image="${product.image}"
                                data-product-category="${product.category}"
                                ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Category filter
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                this.renderProducts();
                document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderProducts();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length > 2) {
                    const results = this.searchProducts(query);
                    this.renderSearchResults(results);
                } else if (query.length === 0) {
                    this.renderProducts();
                }
            });
        }
    }

    renderSearchResults(results) {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">No products found. Try a different search term.</p>';
            return;
        }

        container.innerHTML = results.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${product.category}</span>
                        <span class="product-unit">per ${product.unit}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" 
                                data-product-id="${product.id}" 
                                data-product-name="${product.name}" 
                                data-product-price="${product.price}"
                                data-product-image="${product.image}"
                                data-product-category="${product.category}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Initialize product database
const productDatabase = new ProductDatabase();
