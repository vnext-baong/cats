const quantityInput = document.getElementById("quantity");
let currentPage = 0;

const updateQuantity = (value) => {
  currentPage = 0;
  renderData(currentPage * value, value);
};
const changePage = (newPage) => {
  currentPage = newPage;
  renderData(currentPage * quantityInput.value, quantityInput.value);
};

const previousPage = (n) => {
  if (currentPage > 0) {
    if (n === 1) {
      currentPage--;
      renderData(currentPage * quantityInput.value, quantityInput.value);
    } else if (n === 10 && currentPage >= 10) {
      currentPage -= 10;
      renderData(currentPage * quantityInput.value, quantityInput.value);
    } else if (n === 10 && currentPage < 10) {
      currentPage = 0;
      renderData(currentPage * quantityInput.value, quantityInput.value);
    }
  }
};
let totalPages = 0;

const nextPage = (n) => {
  if (n === 1) {
    if (currentPage < totalPages - 1) {
      currentPage++;
    }
    renderData(currentPage * quantityInput.value, quantityInput.value);
  } else if (n === 10) {
    if (currentPage + 10 >= totalPages) {
      currentPage = totalPages > 0 ? totalPages - 1 : 0;
    } else {
      currentPage += 10;
    }
    renderData(currentPage * quantityInput.value, quantityInput.value);
  }
};

const renderData = async (skip, quantity) => {
  quantity = parseInt(quantity) || 10;
  try {
    const [countResponse, catsResponse] = await Promise.all([
      fetch(`https://cataas.com/api/count`),
      fetch(`https://cataas.com/api/cats?skip=${skip}&limit=${quantity}`),
    ]);
    const countRes = await countResponse.json();
    const cats = await catsResponse.json();
    if (!countResponse.ok || !catsResponse.ok) {
      document.getElementById("cats").innerHTML =
        "<div>Failed to load data.Please try again later.</div>";
      return;
    }

    totalPages = Math.ceil(countRes.count / quantity);
    let html = "";
    let lastAdded = 0;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
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
      button.disabled = currentPage >= totalPages - 1;
    });
    document.getElementById("page").innerHTML = html;

    document.getElementById("cats").innerHTML = cats
      .map(
        (cat) =>
          `<div class="cat-card" onclick="openModal('${cat.id}')">
          <img src="https://cataas.com/cat/${cat.id}" alt="cat" class="cat-image" width="250" height="250">
            <div class="cat-id">ID: ${cat.id}</div>${cat.tags && cat.tags.length > 0 ? `<div class="cat-tags">Tags: ${cat.tags.join(", ")}</div>` : ""}
          </div>`,
      )
      .join("");
  } catch (error) {
    document.getElementById("cats").innerHTML =
      "<div>Failed to load data. Please try again later.</div>";
  }
};

renderData(currentPage * quantityInput.value, quantityInput.value);

let currentCat = null;
const openModal = (catId) => {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  modalImage.src = `https://cataas.com/cat/${catId}`;
  modal.style.display = "block";
  currentCat = catId;
};

const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  const modalInput = document.getElementById("cat-says");
  modalInput.value = "";
  currentCat = null;
};

const addText = () => {
  const textInput = document.getElementById("cat-says");
  const catId = currentCat;
  if (catId && textInput.value.trim() !== "") {
    setLoading(true);
    const xhttp = new XMLHttpRequest();
    let req = `https://cataas.com/cat/${catId}/says/${textInput.value}`;
    xhttp.open("GET", req);
    xhttp.onload = function () {
      if (this.status === 200) {
        const modalImage = document.getElementById("modal-image");
        modalImage.src = req;
      } else {
        alert("Failed to add text to the cat. Please try again.");
      }
      setLoading(false);
    };
    xhttp.send();
  } else {
    alert("Please enter some text to add to the cat.");
  }
};

const setLoading = (isLoading) => {
  const btns = document.querySelectorAll(".btn");
  const textInput = document.getElementById("cat-says");
  const modalContent = document.querySelector(".modal-content");

  btns.forEach((btn) => {
    btn.disabled = isLoading;
  });
  if (textInput) {
    textInput.disabled = isLoading;
  }

  if (isLoading) {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.innerHTML = '<div class="loading"></div>';
    modalContent.appendChild(loadingOverlay);
  } else {
    const loadingOverlay = document.querySelector(".loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.remove();
    }
  }
};
