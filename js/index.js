function addNewProduct(product) {
  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(product)
  }).then(response => {
    if (!response.ok) throw new Error("Failed to add product");
    alert("Product added!");
    displayProducts(); // Refresh list
    document.getElementById("frm-new-product").reset();
  }).catch(error => {
    console.error("Error adding product:", error);
    alert("Error adding product.");
  });
}

function getProducts() {
  return fetch("http://localhost:3000/products")
    .then(response => response.json());
}

function getProductById(id) {
  return fetch(`http://localhost:3000/products/${id}`)
    .then(response => response.json());
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE"
  }).then(response => {
    if (!response.ok) throw new Error("Failed to delete");
    alert("Product deleted.");
    displayProducts();
    clearProductView();
  }).catch(error => {
    console.error("Delete error:", error);
    alert("Failed to delete.");
  });
}

function updateProduct(id, updatedData) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(updatedData)
  })
    .then(response => response.json())
    .then(updatedProduct => {
      alert("Product updated successfully!");
      displaySingleProduct(id);
      displayProducts();
    })
    .catch(error => {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    });
}

async function displayProducts() {
  const products = await getProducts();
  const container = document.querySelector("#product-container");
  container.innerHTML = ""; // clear existing products

  for (const product of products) {
    container.innerHTML += `
      <div class="card col-3 mx-auto mb-2" style="width: 18rem;">
        <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.productName}">
        <div class="card-body">
          <h5 class="card-title">${product.productName}</h5>
          <h5>Ksh.${product.price}</h5>
          <p class="card-text">${product.description}</p>
          <button onclick="displaySingleProduct(${product.id})" class="btn btn-primary btn-sm">View</button>
          <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">x</button>
        </div>
      </div>`;
  }
}

function clearProductView() {
  const viewContainer = document.getElementById("product-view");
  viewContainer.innerHTML = "";
}

async function displaySingleProduct(id) {
  const product = await getProductById(id);
  const viewContainer = document.getElementById("product-view");

  viewContainer.innerHTML = `
    <div class="card mb-3">
      <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.productName}">
      <div class="card-body">
        <h5 class="card-title">Edit Product</h5>

        <form id="frm-update-product">
          <div class="mb-2">
            <label class="form-label">Product Name</label>
            <input type="text" name="productName" value="${product.productName}" class="form-control" required />
          </div>

          <div class="mb-2">
            <label class="form-label">Price (Ksh)</label>
            <input type="number" name="price" value="${product.price}" min="0" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Stock</label>
            <input type="number" name="stock" value="${product.stock || 0}" min="0" class="form-control" required />
          </div>

          <button type="submit" class="btn btn-success btn-sm">Update Product</button>
          <button type="button" class="btn btn-secondary btn-sm ms-2" onclick="clearProductView()">Cancel</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("frm-update-product").addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedData = {
      productName: event.target.productName.value.trim(),
      price: parseFloat(event.target.price.value),
      stock: parseInt(event.target.stock.value)
    };

    updateProduct(id, updatedData);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  displayProducts();

  const newProductForm = document.querySelector("#frm-new-product");
  if (newProductForm) {
    newProductForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const product = {
        productName: event.target.name.value,
        price: event.target.price.value,
        description: event.target.description.value
      };

      addNewProduct(product);
    });
  }
});
