const quantityInput = document.getElementById("quantity");
let currentPage = 0;

const updateQuantity = (value) => {
  currentPage = 0;
  renderPagination(value);
  cats(currentPage, value);
};
const changePage = (newPage) => {
  currentPage = newPage;
  cats(currentPage * quantityInput.value, quantityInput.value);
  renderPagination(quantityInput.value);
};

const previousPage = (n) => {
  if (currentPage > 0) {
    if (n === 1) {
      currentPage--;
      cats(currentPage * quantityInput.value, quantityInput.value);
      renderPagination(quantityInput.value);
    } else if (n === 10 && currentPage >= 10) {
      currentPage -= 10;
      cats(currentPage * quantityInput.value, quantityInput.value);
      renderPagination(quantityInput.value);
    } else if (n === 10 && currentPage < 10) {
      currentPage = 0;
      cats(currentPage * quantityInput.value, quantityInput.value);
      renderPagination(quantityInput.value);
    }
  }
};
let totalPages = 0;

const nextPage = (n) => {
  if (n === 1) {
    if (currentPage < totalPages - 1) {
      currentPage++;
    }
    cats(currentPage * quantityInput.value, quantityInput.value);
    renderPagination(quantityInput.value);
  } else if (n === 10) {
    if (currentPage + 10 >= totalPages) {
      currentPage = totalPages > 0 ? totalPages - 1 : 0;
    } else {
      currentPage += 10;
    }
    cats(currentPage * quantityInput.value, quantityInput.value);
    renderPagination(quantityInput.value);
  }
};

const renderPagination = (quantity) => {
  quantity = parseInt(quantity) || 10;
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `https://cataas.com/api/count`);
  xhttp.onload = function () {
    if (this.status === 200) {
      let totalCats = 100;
      try {
        const response = JSON.parse(this.responseText);
        totalCats = response.count || 100;
      } catch (e) {
        totalCats = parseInt(this.responseText) || 100;
      }
      const pages = Math.ceil(totalCats / quantity);
      totalPages = pages;
      let html = "";
      let lastAdded = 0;

      for (let i = 1; i <= pages; i++) {
        if (
          i === 1 ||
          i === pages ||
          (i >= currentPage && i <= currentPage + 2)
        ) {
          if (lastAdded + 1 < i) {
            html += `<span style="padding: 10px;">...</span>`;
          }
          if (i === currentPage + 1) {
            html += `<button class="page-button active" onclick="changePage(${i - 1})">${i}</button>`;
          } else {
            html += `<button class="page-button" onclick="changePage(${i - 1})">${i}</button>`;
          }
          lastAdded = i;
        }
      }
      document.querySelectorAll(".prev").forEach((button) => {
        button.disabled = currentPage === 0;
      });
      document.querySelectorAll(".next").forEach((button) => {
        button.disabled = currentPage >= pages - 1;
      });
      document.getElementById("page").innerHTML = html;
    }
  };
  xhttp.send();
};

renderPagination(quantityInput.value);

const cats = (skip, limit) => {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);
      document.getElementById("cats").innerHTML = response
        .map(
          (cat) =>
            `<div class="cat-card" >
          <img src="https://cataas.com/cat/${cat.id}" alt="cat" class="cat-image" width="250" height="250">
            <div class="cat-id">ID: ${cat.id}</div>${cat.tags && cat.tags.length > 0 ? `<div class="cat-tags">Tags: ${cat.tags.join(", ")}</div>` : ""}
          </div>`,
        )
        .join("");
    }
  };

  xhttp.open("GET", `https://cataas.com/api/cats?skip=${skip}&limit=${limit}`);
  xhttp.send();
  return xhttp;
};
cats(currentPage * quantityInput.value, quantityInput.value);
