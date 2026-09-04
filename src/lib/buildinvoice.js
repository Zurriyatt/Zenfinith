export function buildInvoiceHtml(order) {
  const items = order.items.map(item=>
    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td></tr>`
  ).join("");

  return `
    <h1>Thank you for your order!</h1>
    <p>Order ID: ${order.id}</p>
    <table border="1" cellpadding="5">${items}</table>
    <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
    <p>Discount: -$${order.discount.toFixed(2)}</p>
    <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
    <p>Address: ${order.address}, ${order.city}, ${order.country}</p>
  `;
}