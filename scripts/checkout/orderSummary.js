import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from "../../data/cart.js";
import {products, getProduct} from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";

import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm';
import { renderPaymentSummary } from "./paymentSummary.js";

const today = dayjs();
const deliverydate = today.add(7, 'days');
const format = deliverydate.format('dddd, MMMM D');
console.log(format);

export function renderOrderSummary() {


let cartSummaryHTML ='';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const format = deliveryDate.format('dddd, MMMM D');


    cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${format}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-number-input" type="number">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = ``;
  deliveryOptions.forEach((option) => {
    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, 'days');
    const format = deliveryDate.format('dddd, MMMM D');
    const price = option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)} -`;

    const isChecked = option.id === cartItem.deliveryOptionId ? 'checked' : '';

    html +=  `
    <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${option.id}">
      <input type="radio"
        ${isChecked}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
      <div class="delivery-option-date">
        ${format}
      </div>
      <div class="delivery-option-price">
      ${price} Shipping
      </div>
     </div>
    </div>
    `
  });
  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        updateCartQuantity();
    });
});

function updateCartQuantity() {

document.querySelector('.js-checkout').innerHTML=`${calculateCartQuantity()} Items`;
}
updateCartQuantity();

document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    link.style.display="none";
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.querySelector('.js-number-input').classList.add('in-process');
    container.querySelector('.js-save-link').classList.add('in-process');
  });
});

document.querySelectorAll('.js-save-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const newQuantity = Number(container.querySelector('.js-number-input').value);
    if(newQuantity>=0) {
      container.querySelector('.js-number-input').classList.remove('in-process');
      container.querySelector('.js-save-link').classList.remove('in-process');
      container.querySelector('.js-update-link').style.display="inline";
      updateQuantity(productId, newQuantity);
      container.querySelector('.quantity-label').innerHTML=`${newQuantity}`;
      updateCartQuantity();
    } else {
      alert('Not a valid Quantity');
    }
  });
});

document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
  });
});

}
