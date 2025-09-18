

function addNewProduct(product) {
    fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(product)
    })
}

function getProducts() {
    return fetch("http://localhost:3000/products", {
        method: "GET"
    }).then(response => response.json())
        .then(data => data)
}

function getProductById(id){
 return fetch(`http://localhost:3000/products/${id}`, {
        method: "GET"
    }).then(response => response.json())
        .then(data => data)
}

function deleteProduct(id) {
    fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
    })
}

async function displaySingleProduct(id){

    const  product = await getProductById(id)

    console.log(product)

}

async function displayProducts() {

    const products = await getProducts()

    const container = document.querySelector("#product-container")

    for (product of products) {
        container.innerHTML += ` <div class="card col-3 mx-auto mb-2" style="width: 18rem;">
                <img src="${product.thumbnail}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.productName}</h5>
                    <h5>Ksh.${product.price}</h5>
                    <p class="card-text">${product.description}</p>
                    <button onclick="displaySingleProduct(${product.id})" class="btn btn-primary btn-sm">View</button>
                    <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">x</button>
                </div>
            </div>`
    }
}

async function displaySingleProduct(id) {
  const product = await getProductById(id);
  const viewContainer = document.getElementById("product-view");

  viewContainer.innerHTML = `
    <div class="card mb-3">
      <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.productName}">
      <div class="card-body">
        <h5 class="card-title">${product.productName}</h5>
        <p class="card-text"><strong>Price:</strong> Ksh. ${product.price}</p>
        <p class="card-text"><strong>Description:</strong> ${product.description}</p>
        ${product.category ? `<p class="card-text"><strong>Category:</strong> ${product.category}</p>` : ''}
        ${product.stock ? `<p class="card-text"><strong>Stock:</strong> ${product.stock}</p>` : ''}
        ${product.manufacturer ? `<p class="card-text"><strong>Manufacturer:</strong> ${product.manufacturer}</p>` : ''}

        <hr>
        <h6>Update Price & Stock</h6>
        <form id="frm-update-product">
          <input type="number" name="price" placeholder="New Price" value="${product.price}" class="form-control mb-2" required />
          <input type="number" name="stock" placeholder="New Stock" value="${product.stock || 0}" class="form-control mb-2" required />
          <button type="submit" class="btn btn-success btn-sm">Update</button>
        </form>
      </div>
    </div>
  `;

  
  document.getElementById("frm-update-product").addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedData = {
      price: parseFloat(event.target.price.value),
      stock: parseInt(event.target.stock.value)
    };

    updateProduct(id, updatedData);
  });
}

function updateProduct(id, updatedData) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH", // or "PUT" depending on your backend
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(updatedProduct => {
    alert("Product updated successfully!");
    displaySingleProduct(id); // Refresh the single product view
    displayProducts(); // Optionally refresh the product list
  })
  .catch(error => {
    console.error("Error updating product:", error);
    alert("Failed to update product.");
  });
}

document.addEventListener("DOMContentLoaded", function () {

    displayProducts()

    document.querySelector("#frm-new-product").addEventListener("submit", function (event) {
        event.preventDefault()
        const product = {
            productName: event.target.name.value,
            price: event.target.price.value,
            description: event.target.description.value
        }
        addNewProduct(product)
    })

})



