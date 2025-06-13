function Cart(localStorageKey) {
    const cart = {
        cartItems: undefined,
        
        loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));

        if(!this.cartItems) {
        this.cartItems = [{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
            deliveryOptionId: '2'
            }];
        }
        },

        saveToStorage() {
        localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
        },

        addToCart(productId) {
        const selector = document.querySelector(`.js-quantity-selector-${productId}`);
        let selectorValue = selector.value; 
        selectorValue  = Number(selectorValue);
        let matchingItem;
        this.cartItems.forEach((item) => {
            if(productId === item.productId) {
                matchingItem = item;
            }
        });
        if(matchingItem) {
            matchingItem.quantity += selectorValue;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: selectorValue,
                deliveryOptionId: '1'
            });
        }
        this.saveToStorage();
        },

        addToCartTestOnly(productId, quantity = null) {
        let selectorValue = quantity;

    // If quantity not provided (i.e. website usage), get it from DOM
    if (selectorValue === null) {
        const selector = document.querySelector(`.js-quantity-selector-${productId}`);
        
        // Defensive check (optional but helpful for debugging)
        if (!selector) {
        console.warn(`Quantity selector not found for productId: ${productId}`);
        return;
        }

        selectorValue = Number(selector.value);
    }

        let matchingItem;
        this.cartItems.forEach((item) => {
            if (productId === item.productId) {
            matchingItem = item;
            }
        });

        if (matchingItem) {
            matchingItem.quantity += selectorValue;
        } else {
            this.cartItems.push({
            productId: productId,
            quantity: selectorValue,
            deliveryOptionId: '1'
            });
        }

        this.saveToStorage();
        },

        removeFromCart(productId) {
        const newCart = [];

        this.cartItems.forEach((cartItem) => {
            if(cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        });
        this.cartItems = newCart;
        this.saveToStorage();
        },

        calculateCartQuantity() {
        let cartQuantity = 0;
        this.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });
        return cartQuantity;
        },

        updateQuantity(productId, newQuantity) {
        const selector = document.querySelector(`.js-quantity-selector-${productId}`);
        let matchingItem;
        this.cartItems.forEach((item) => {
            if(productId === item.productId) {
                matchingItem = item;
            }
        });
        if(matchingItem) {
            matchingItem.quantity = newQuantity;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: newQuantity
            });
        }
        this.saveToStorage();
        },

        updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach((item) => {
            if(productId === item.productId) {
                matchingItem = item;
            }
        });

        matchingItem.deliveryOptionId = deliveryOptionId;
        this.saveToStorage();
        }
    };
    return cart;
}

const cart = Cart('cart-oop');

cart.loadFromStorage();
















