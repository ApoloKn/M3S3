const API_URL = 'http://localhost:3000/paymentInvoice';
const $form = document.getElementById('form');
const $name = document.getElementById('name');
const $price = document.getElementById('price');
const $list = document.getElementById('product-list');
let editingId = null;

async function getProducts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error("GET error:", err);
  }
}

function renderProducts(products) {
  $list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.name}</strong> - $${p.price}
      <button class="delete" data-id="${p.id}">Delete</button>
      <button class="edit" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">Edit</button>
    `;
    $list.appendChild(li);
  });

  document.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
  );

  document.querySelectorAll('.edit').forEach(btn =>
    btn.addEventListener('click', () => editProduct(
      btn.dataset.id,
      btn.dataset.name,
      btn.dataset.price
    ))
  );
}

$form.addEventListener('submit', function (e) {
  e.preventDefault();
  const product = {
    name: $name.value.trim(),
    price: parseFloat($price.value)
  };

  if (!product.name || isNaN(product.price)) {
    alert("insert data please");
    return;
  }

  if (editingId) {
    updateProduct(editingId, product);
  } else {
    postProduct(product);
  }
});

async function postProduct(product) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("error post the product");
    $form.reset();
    document.getElementById('submit').textContent = 'ADD';
    getProducts();
  } catch (err) {
    console.error("POST error:", err);
  }
}

function editProduct(id, name, price) {
  $name.value = name;
  $price.value = price;
  editingId = id;
  document.getElementById('submit').textContent = 'SAVE';
}

async function updateProduct(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error al actualizar");
    editingId = null;
    $form.reset();
    document.getElementById('submit').textContent = 'ADD';
    getProducts();
  } catch (err) {
    console.error("Error en PUT:", err);
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Error al eliminar");
    getProducts();
  } catch (err) {
    console.error("Error en DELETE:", err);
  }
}

getProducts();
