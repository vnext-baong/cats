const quantityInput = document.getElementById("quantity");
let currentPage = 0;
updateQuantity = (value) => {
renderPagination(value);
cats(currentPage, value);

}
changePage = (newPage) => {
    currentPage = newPage;
    cats(currentPage * quantityInput.value, quantityInput.value);
    renderPagination(quantityInput.value);
}

previousPage = (n) => {
    if (currentPage > 0) {
        if (n === 1) {
        currentPage--;
        cats(currentPage * quantityInput.value, quantityInput.value);
        renderPagination(quantityInput.value);
        }else if(n === 10){
            currentPage -= 10;
            cats(currentPage *quantityInput.value, quantityInput.value);
            renderPagination(quantityInput.value);
        }
    }
}   

nextPage = (n) => {
    if (n === 1) {
        currentPage++;
        cats(currentPage * quantityInput.value, quantityInput.value);
        renderPagination(quantityInput.value);
    }else if(n === 10){
        currentPage += 10;
        cats(currentPage * quantityInput.value, quantityInput.value);
        renderPagination(quantityInput.value);
    }
}



const renderPagination = (quantity)=>{
    quantity = parseInt(quantity) || 10;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://cataas.com/api/count`);
    xhttp.onload = function() {
        if (this.status === 200) {
            let totalCats = 100;
            try {
                const response = JSON.parse(this.responseText);
                totalCats = response.count || 100;
            } catch (e) {
                totalCats = parseInt(this.responseText) || 100; 
            }
            const pages = Math.ceil(totalCats / quantity);
            
            let html = "";
            let lastAdded = 0;
            
            for(let i=1; i<=pages; i++){
                if (i <= 3 || i === (currentPage + 1) || i === pages) {
                    if (lastAdded + 1 < i) {
                        html += `<span style="padding: 10px;">...</span>`;
                    }
                    if(i === currentPage + 1){
                        html += `<button class="page-button active" onclick="changePage(${i - 1})">${i}</button>`;
                    } else {
                        html += `<button class="page-button" onclick="changePage(${i - 1})">${i}</button>`;
                    }
                    lastAdded = i;
                }
            }
            document.getElementById("page").innerHTML = html;
        }
    };
    xhttp.send();
}

renderPagination(quantityInput.value);


const cats = (skip, limit)=>{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            document.getElementById("cats").innerHTML = response.map(cat => `<img src="https://cataas.com/cat/${cat.id}" alt="cat" width="200" height="200">`).join('');
        }
    };

    xhttp.open("GET", `https://cataas.com/api/cats?skip=${skip}&limit=${limit}`);
    xhttp.send();
    return xhttp;
}
cats(currentPage * quantityInput.value, quantityInput.value);
