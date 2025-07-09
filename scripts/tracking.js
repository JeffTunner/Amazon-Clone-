import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  let productDetails = order.products.find((details) => details.productId === product.id);

  if (!productDetails) {
    document.querySelector('.js-order-tracking').innerHTML = `<p>Tracking info not found.</p>`;
    return;
  }

  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const today = dayjs();

  const totalDuration = deliveryTime.diff(orderTime);
  const elapsedDuration = today.diff(orderTime);
  let percentProgress = (elapsedDuration / totalDuration) * 100;

  // Clamp between 0 and 100, round to 2 decimal places
  percentProgress = Math.min(Math.max(percentProgress, 0), 100);
  percentProgress = Math.round(percentProgress * 100) / 100;

  // Determine which step is active
  let statusStep = '';
  if (percentProgress < 50) {
    statusStep = 'preparing';
  } else if (percentProgress >= 50 && percentProgress < 100) {
    statusStep = 'shipped';
  } else {
    statusStep = 'delivered';
  }

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${deliveryTime.format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${statusStep === 'preparing' ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${statusStep === 'shipped' ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${statusStep === 'delivered' ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar-fill" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

  // For debug clarity
  console.log(`Progress for ${product.name}: ${percentProgress.toFixed(2)}% → Step: ${statusStep}`);
}

loadPage();
