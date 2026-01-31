let products = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;
let sortField = "";
let sortOrder = "asc";

/* ================= GET ALL ================= */
async function getAll() {
    const res = await fetch("https://api.escuelajs.co/api/v1/products");
    const data = await res.json();

    // 🔥 FIX LỖI API ESCUELA (images array | images string)
    products = data.map(p => {
        let imageUrl = "https://via.placeholder.com/150";

        if (Array.isArray(p.images) && p.images.length > 0) {
            imageUrl = p.images[0];
        } else if (typeof p.images === "string") {
            try {
                const parsed = JSON.parse(p.images);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    imageUrl = parsed[0];
                }
            } catch { }
        }

        return { ...p, image: imageUrl };
    });

    filteredProducts = [...products];
    render();
}

/* ================= RENDER ================= */
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
          <img 
            src="${p.image}"
            onerror="this.src='https://via.placeholder.com/150'"
          >
        </td>
        <td>$${p.price}</td>
      </tr>
    `;
    });

    renderPagination();
}

/* ================= PAGINATION ================= */
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

/* ================= SEARCH ================= */
function handleSearch(value) {
    filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase())
    );
    currentPage = 1;
    render();
}

/* ================= SORT ================= */
function sortBy(field) {
    if (sortField === field) {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
        sortField = field;
        sortOrder = "asc";
    }

    filteredProducts.sort((a, b) => {
        if (field === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        }
        return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });

    render();
}

/* INIT */
getAll();
