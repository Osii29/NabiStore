
// Abre y cierra el panel lateral del carrito
let cart = [];
let currentProduct = {};
let flavorData = null; // Guardará la estructura de sabores actual

function toggleCart() {
  document.getElementById('sidebar-cart').classList.toggle('open');
}

function openProductModal(name, price, data) {
  currentProduct = { name, price };
  flavorData = data;
  
  document.getElementById('modal-product-title').innerText = name;
  const categoryContainer = document.getElementById('category-container');
  const categorySelect = document.getElementById('category-select');
  
  if (!Array.isArray(data)) {
    // Es un objeto (Submenú de marcas)
    categoryContainer.style.display = 'block';
    categorySelect.innerHTML = '';
    
    Object.keys(data).forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.innerText = brand;
      categorySelect.appendChild(option);
    });
    updateFlavorOptions(); // Carga los sabores de la primera marca
  } else {
    // Es un arreglo simple
    categoryContainer.style.display = 'none';
    populateSelect('flavor-select', data);
  }

  document.getElementById('dynamicModal').classList.add('show');
}

// Función para actualizar el segundo menú basado en la marca elegida
function updateFlavorOptions() {
  const brand = document.getElementById('category-select').value;
  const flavors = flavorData[brand];
  populateSelect('flavor-select', flavors);
}

// Helper para llenar cualquier select
function populateSelect(elementId, items) {
  const select = document.getElementById(elementId);
  select.innerHTML = '';
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item;
    option.innerText = item;
    select.appendChild(option);
  });
}

function closeModal() {
  document.getElementById('dynamicModal').classList.remove('show');
}

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  const flavor = document.getElementById('flavor-select').value;
  const brandSelect = document.getElementById('category-select');
  
  // Si hay marca (bebidas), la incluimos en el nombre
  let fullName = `${currentProduct.name} ${flavor}`;
  if (document.getElementById('category-container').style.display !== 'none') {
    fullName = `${currentProduct.name} ${brandSelect.value} - ${flavor}`;
  }
  
  cart.push({ name: fullName, price: currentProduct.price });
  updateCart();
  closeModal();
});

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span> 
      <span>$${item.price} <button class="remove" onclick="removeFromCart(${index})">X</button></span>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.innerHTML = `<strong>Total: $${total} MXN</strong>`;
  cartCount.innerText = `(${cart.length})`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function emptyCart() {
  cart = [];
  updateCart();
}

function processPayment() {
  if (cart.length === 0) return alert("Carrito vacío");
  const street = document.getElementById('street').value;
  if (!street) return alert("Faltan datos de envío");
  
  const total = cart.reduce((a, b) => a + b.price, 0);
  alert(`Pedido confirmado para Nabi Store.\nEnvío a: ${street}\nTotal: $${total} MXN.`);
  emptyCart();
  toggleCart();
}
// Cierra el modal
function closeModal() {
  document.getElementById('dynamicModal').classList.remove('show');
}

// Evento para agregar el producto con su sabor al carrito
document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  const selectedFlavor = document.getElementById('flavor-select').value;
  const finalName = `${currentProduct.name} (${selectedFlavor})`;
  
  cart.push({ name: finalName, price: currentProduct.price });
  updateCart();
  closeModal();
  
  // Pequeño feedback visual en el botón del carrito
  const btn = document.querySelector('.cart-toggle');
  btn.style.transform = 'scale(1.1)';
  setTimeout(() => btn.style.transform = 'scale(1)', 200);
});

// Renderiza los elementos del carrito en el HTML
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span> 
      <span>$${item.price} <button class="remove" onclick="removeFromCart(${index})">X</button></span>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.innerHTML = `<strong>Total: $${total} MXN</strong>`;
  cartCount.innerText = `(${cart.length})`;
}

// Elimina un ítem específico del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Vacía todo el carrito
function emptyCart() {
  cart = [];
  updateCart();
}

// Simula el procesamiento del pedido
function processPayment() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const cp = document.getElementById('postal-code').value;
  const street = document.getElementById('street').value;
  const method = document.getElementById('payment-method').options[document.getElementById('payment-method').selectedIndex].text;

  if (!cp || !street) {
    alert("Completa tu dirección de envío por favor.");
    return;
  }

  // Calcula el total nuevamente para el mensaje
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  alert(`¡Pedido confirmado para ${street}, CP ${cp}!\nMétodo: ${method}\nTotal: $${total} MXN.`);
  emptyCart();
  toggleCart();
}