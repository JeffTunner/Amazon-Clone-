export let cart;

loadFromStorage();

export function loadFromStorage() {
cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
    cart = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
    }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
    }];
}
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
    const selector = document.querySelector(`.js-quantity-selector-${productId}`);
    let selectorValue;

    if (selector) {
        selectorValue = Number(selector.value);
    } else {
        selectorValue = quantity; // fallback if selector not found
    }

    let matchingItem;
    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += selectorValue;
    } else {
        cart.push({
            productId: productId,
            quantity: selectorValue,
            deliveryOptionId: '1'
        });
    }

    saveToStorage();
}


export function addToCartTestOnly(productId, quantity = null) {
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
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += selectorValue;
  } else {
    cart.push({
      productId: productId,
      quantity: selectorValue,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}


export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if(cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

 export function calculateCartQuantity() {
    let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
});
return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
    const selector = document.querySelector(`.js-quantity-selector-${productId}`);
    let matchingItem;
    cart.forEach((item) => {
        if(productId === item.productId) {
            matchingItem = item;
        }
    });
    if(matchingItem) {
        matchingItem.quantity = newQuantity;
    } else {
        cart.push({
            productId: productId,
            quantity: newQuantity
        });
    }
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach((item) => {
        if(productId === item.productId) {
            matchingItem = item;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
}

export async function loadCartFetch() {
    const response = await fetch('https://supersimplebackend.dev/cart');
    const text = await response.text();
    console.log(text);
    return text;

}

export function resetCart() {
    cart = [];
    saveToStorage();
}

