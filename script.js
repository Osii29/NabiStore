
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
  // 1. Verificamos que haya algo en el carrito
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  // 2. Extraemos los valores de los inputs
  const cp = document.getElementById('postal-code').value;
  const street = document.getElementById('street').value;
  const paymentSelect = document.getElementById('payment-method');
  const method = paymentSelect.options[paymentSelect.selectedIndex].text;

  // 3. Validamos que no falten datos importantes
  if (!cp || !street) {
    alert("Completa tu dirección de envío por favor.");
    return;
  }

  // 4. Calculamos el total
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // 5. Armamos el mensaje final personalizado
  alert(`¡Pedido confirmado para ${street}, CP ${cp}!\nMétodo: ${method}\nTotal: $${total} MXN.`);
  
  // 6. Limpiamos todo
  emptyCart();
  toggleCart();
}
