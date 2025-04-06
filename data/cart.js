export const cart = [];

export function addToCart(productId) {
    const selector = document.querySelector(`.js-quantity-selector-${productId}`);
    let selectorValue = selector.value; 
    selectorValue  = Number(selectorValue);
    let matchingItem;
    cart.forEach((item) => {
        if(productId === item.productId) {
            matchingItem = item;
        }
    });
    if(matchingItem) {
        matchingItem.quantity += selectorValue;
    } else {
        cart.push({
            productId: productId,
            quantity: selectorValue
        });
    }
}