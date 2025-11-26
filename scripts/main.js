document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const cards = document.querySelectorAll('.card');
    const container = document.querySelector('.container');
    
    let currentSort = 'default';
    let activeFilters = [];
    let originalCardOrder = Array.from(cards);
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const options = dropdown.querySelectorAll('.dropdown-option');
        
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        options.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;
                
                toggle.querySelector('span').textContent = text;
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                dropdown.classList.remove('active');
                currentSort = value;
                SortWithAnim();
            });
        });
    });

    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    const filtersDropdown = document.querySelector('.filters-dropdown');
    const filtersToggle = filtersDropdown.querySelector('.filters-toggle');
    const filtersMenu = filtersDropdown.querySelector('.filters-menu');
    const filterOptions = filtersDropdown.querySelectorAll('.filter-option');
    const filterChecks = filtersDropdown.querySelectorAll('.filter-check');
    
    filtersToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        filtersDropdown.classList.toggle('active');
    });
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const checkbox = this.querySelector('.filter-check');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
            updateActiveFilters();
            SortWithAnim();
        });
    });
    
    function getCardBrand(card) {
        return card.querySelector('.title').textContent;
    }
    
    function getCardPrice(card) {
        const priceText = card.querySelector('.price').textContent;
        return parseInt(priceText.replace(/\s+/g, '').replace('руб', ''));
    }
    
    function isCardAvailable(card) {
        // Я пока не уверен, какая логика тут нужна, поэтому ничего не добавлю
        return true;
    }
    
    function updateActiveFilters() {
        activeFilters = [];
        filterChecks.forEach(checkbox => {
            if (checkbox.checked) {
                const brand = checkbox.closest('.filter-option').querySelector('span').textContent;
                activeFilters.push(brand);
            }
        });
    }
    
    function SortWithAnim() {
        cards.forEach(card => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        setTimeout(() => {
            applySortingAndFiltering();
            setTimeout(() => {
                const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
                visibleCards.forEach((card, index) => {
                    card.style.transition = `all 0.4s ease ${index * 0.1}s`;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, 50);
        }, 400);
    }
    
    function applySortingAndFiltering() {
        let visibleCards = Array.from(cards);
        if (activeFilters.length > 0) {
            visibleCards = visibleCards.filter(card => {
                const cardBrand = getCardBrand(card);
                return activeFilters.includes(cardBrand);
            });
        }
        visibleCards.sort((a, b) => {
            const priceA = getCardPrice(a);
            const priceB = getCardPrice(b);
            
            switch(currentSort) {
                case 'expensive':
                    return priceB - priceA;
                case 'available':
                    const availableA = isCardAvailable(a);
                    const availableB = isCardAvailable(b);
                    if (availableA && !availableB) return -1;
                    if (!availableA && availableB) return 1;
                    return 0;
                case 'default':
                default:
                    return originalCardOrder.indexOf(a) - originalCardOrder.indexOf(b);
            }
        });
        cards.forEach(card => {
            card.style.display = 'none';
        });
        visibleCards.forEach(card => {
            card.style.display = 'flex';
        });
        visibleCards.forEach((card, index) => {
            container.appendChild(card);
        });
    }
    document.addEventListener('click', function() {
        filtersDropdown.classList.remove('active');
    });

    filtersMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    cards.forEach(card => {
        card.style.transition = 'all 0.4s ease';
    });
    
    updateActiveFilters();
});