let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;

async function getAll() {
    const res = await fetch("https://api.escuelajs.co/api/v1/products");
    const data = await res.json();

    products = data.map(p => ({
        ...p,
        image: `https://picsum.photos/seed/${p.id}/120/120`
    }));

    filteredProducts = [...products];
    render();
}

function render() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredProducts.slice(start, end);

    const tbody = document.getElementById("productBody");
    tbody.innerHTML = "";

    data.forEach(p => {
        tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>
          <div class="img-wrapper">
            <img src="${p.image}" alt="${p.title}">
            <div class="img-desc">
              ${p.description}
            </div>
          </div>
        </td>
        <td>$${p.price}</td>
      </tr>
    `;
    });

    renderPagination();
}

function renderPagination() {
    const totalPage = Math.ceil(filteredProducts.length / pageSize);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPage; i++) {
        pagination.innerHTML += `
      <button onclick="goPage(${i})">${i}</button>
    `;
    }
}

function goPage(page) {
    currentPage = page;
    render();
}

function changePageSize(size) {
    pageSize = Number(size);
    currentPage = 1;
    render();
}

function handleSearch(value) {
    filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase())
    );
    currentPage = 1;
    render();
}

getAll();
