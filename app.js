/* =========================================================================
   UBA's Honey - Interactive Web Logic
   Features: Header scroll styling, Product Filtering, Shopping Cart, Modals.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Header Scroll Effect
  // =========================================================================
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // =========================================================================
  // 2. Product Category Filtering
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      // Add active class to current tab
      tab.classList.add('active');

      const category = tab.getAttribute('data-category').toLowerCase();

      productCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category').toLowerCase().split(' ');

        if (category === 'all' || cardCategories.includes(category)) {
          card.classList.remove('hidden');
          // Simple entry fade animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // =========================================================================
  // 3. Shopping Cart Drawer System
  // =========================================================================
  let cart = [];
  const cartDrawer = document.getElementById('cart-drawer');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCountBadge = document.getElementById('cart-count');
  const subtotalVal = document.getElementById('subtotal-val');
  const totalVal = document.getElementById('total-val');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Toggle Cart Open/Close
  cartToggleBtn.addEventListener('click', () => cartDrawer.classList.toggle('open'));
  cartCloseBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

  // Add to Cart Click Handlers
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      const img = button.getAttribute('data-img');

      addToCart(id, name, price, img);
      
      // Auto-open cart drawer when adding item
      cartDrawer.classList.add('open');
    });
  });

  // Cart Functions
  function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }

    updateCartUI();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function updateCartUI() {
    // Empty message
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="cart-empty-message">Your shopping cart is empty.<br>Select a jar to get started!</p>`;
      cartCountBadge.textContent = '0';
      cartCountBadge.style.display = 'none';
      subtotalVal.textContent = 'Rp 0.00';
      totalVal.textContent = 'Rp 0.00';
      return;
    }

    // Render items
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      totalItems += item.qty;

      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.innerHTML = `
        <div class="cart-item-img-box">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-price">Rp ${item.price.toFixed(2)}</span>
          <div class="cart-item-qty">Qty: ${item.qty}</div>
        </div>
        <button class="remove-cart-item" data-id="${item.id}">&times;</button>
      `;

      // Remove item event
      itemEl.querySelector('.remove-cart-item').addEventListener('click', () => {
        removeFromCart(item.id);
      });

      cartItemsContainer.appendChild(itemEl);
    });

    // Update Totals
    cartCountBadge.textContent = totalItems;
    cartCountBadge.style.display = 'flex';
    subtotalVal.textContent = `Rp ${subtotal.toFixed(2)}`;
    totalVal.textContent = `Rp ${subtotal.toFixed(2)}`;
  }


  // =========================================================================
  // 4. Modals & Overlays
  // =========================================================================
  const reservationModal = document.getElementById('reservation-modal');
  const reservationBtn = document.getElementById('reservation-btn');
  const reservationClose = document.getElementById('reservation-close');
  const reservationForm = document.getElementById('reservation-form');

  const contactModal = document.getElementById('contact-modal');
  const contactBtn = document.getElementById('contact-btn');
  const contactClose = document.getElementById('contact-close');
  const contactForm = document.getElementById('contact-form');

  const promoModal = document.getElementById('promo-modal');
  const heroPromoBtn = document.getElementById('hero-promo-btn');
  const promoClose = document.getElementById('promo-close');
  const copyCouponBtn = document.getElementById('copy-coupon-btn');
  const couponCodeText = document.getElementById('coupon-code');

  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutItemsContainer = document.getElementById('receipt-items');
  const checkoutTotalText = document.getElementById('receipt-total');
  const receiptCloseBtn = document.getElementById('receipt-close-btn');

  // Generic modal control
  function openModal(modal) {
    modal.classList.add('open');
  }

  function closeModal(modal) {
    modal.classList.remove('open');
  }

  // Reservation Modal Events
  if (reservationBtn) reservationBtn.addEventListener('click', () => openModal(reservationModal));
  if (reservationClose) reservationClose.addEventListener('click', () => closeModal(reservationModal));
  
  // Contact Modal Events
  if (contactBtn) contactBtn.addEventListener('click', () => openModal(contactModal));
  if (contactClose) contactClose.addEventListener('click', () => closeModal(contactModal));

  // Promo Modal Events
  if (heroPromoBtn) heroPromoBtn.addEventListener('click', () => openModal(promoModal));
  if (promoClose) promoClose.addEventListener('click', () => closeModal(promoModal));

  // Copy Promo Coupon Code
  if (copyCouponBtn) {
    copyCouponBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(couponCodeText.textContent).then(() => {
        copyCouponBtn.textContent = 'Copied!';
        copyCouponBtn.style.backgroundColor = '#6A9C78';
        setTimeout(() => {
          copyCouponBtn.textContent = 'Copy Code';
          copyCouponBtn.style.backgroundColor = '#1E150B';
        }, 2000);
      });
    });
  }

  // Form Submissions
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`Thank you, ${document.getElementById('res-name').value}! Your harvesting reservation has been confirmed. We've sent a details email to ${document.getElementById('res-email').value}.`);
      reservationForm.reset();
      closeModal(reservationModal);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`Message sent! Thank you for contacting us, we'll respond to your query shortly.`);
      contactForm.reset();
      closeModal(contactModal);
    });
  }

  // Close modals on clicking overlay background
  const modals = [reservationModal, contactModal, promoModal, checkoutOverlay];
  modals.forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });


  // =========================================================================
  // 5. Checkout System
  // =========================================================================
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Add products first.');
      return;
    }

    // Build Receipt HTML
    checkoutItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;

      const receiptItemRow = document.createElement('div');
      receiptItemRow.classList.add('receipt-line', 'receipt-item-line');
      receiptItemRow.innerHTML = `
        <span><span class="receipt-item-name">${item.name}</span> x${item.qty}</span>
        <span>Rp ${lineTotal.toFixed(2)}</span>
      `;
      checkoutItemsContainer.appendChild(receiptItemRow);
    });

    checkoutTotalText.textContent = `Rp ${total.toFixed(2)}`;

    // Close Cart Drawer and Open Receipt Overlay
    cartDrawer.classList.remove('open');
    openModal(checkoutOverlay);

    // Empty Cart
    cart = [];
    updateCartUI();
  });

  if (receiptCloseBtn) {
    receiptCloseBtn.addEventListener('click', () => {
      closeModal(checkoutOverlay);
    });
  }

});
