
const searchInput = document.getElementById('searchInput');
const sortBySelect = document.getElementById('sortBy');
const catalogGrid = document.querySelector('.catalog-grid');
const cartCountElement = document.getElementById('cartCount');


const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeModal = document.querySelector('.close-modal');
const cartItemList = document.getElementById('cartItemList');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const btnCheckout = document.getElementById('btnCheckout');
const subscribeModal = document.getElementById('subscribeModal');

document.getElementById('btnSuscribete').addEventListener('click', () => {
    subscribeModal.style.display = 'block';
});

document.getElementById('closeSubscribeModal').addEventListener('click', () => {
    resetSubscribeModal();
    subscribeModal.style.display = 'none';
});

document.getElementById('btnConfirmSubscribe').addEventListener('click', () => {
    const email = document.getElementById('subscribeEmail').value;
    if (!email || !email.includes('@')) {
        alert('Por favor ingresa un correo válido.');
        return;
    }
    document.getElementById('subscribeSuccess').style.display = 'block';
    document.getElementById('btnConfirmSubscribe').style.display = 'none';
    document.getElementById('subscribeEmail').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === subscribeModal) {
        resetSubscribeModal();
        subscribeModal.style.display = 'none';
    }
});

function resetSubscribeModal() {
    document.getElementById('subscribeSuccess').style.display = 'none';
    document.getElementById('btnConfirmSubscribe').style.display = 'block';
    document.getElementById('subscribeEmail').style.display = 'block';
    document.getElementById('subscribeEmail').value = '';
}


let cartItems = []; 


const booksData = [
    {
        title: "Lady Oscar (La rosa de Versalles)",
        author: "Riyoko Ikeda",
        genre: "Histórico",
        price: 10.00,
        stock: 10,
        desc: "Drama histórico sobre Oscar François de Jarjayes, una mujer criada como hombre que sirve en la Guardia Real durante la Revolución Francesa.",
        img: "https://res.cloudinary.com/dfhwxnhsl/image/upload/v1770478057/lady_uxwyjc.jpg"
    },
    {
        title: "Los Caballeros del Zodiaco",
        author: "Masami Kurumada",
        genre: "Fantasía",
        price: 11.00,
        stock: 15,
        desc: "Jóvenes guerreros luchan usando armaduras sagradas para proteger a la diosa Atenea, combinando acción, amistad y mitología.",
        img: "https://res.cloudinary.com/dfhwxnhsl/image/upload/v1770466304/Caballero_hd6fmc.jpg"
    },
    {
        title: "Capitán Tsubasa",
        author: "Yoichi Takahashi",
        genre: "Acción",
        price: 12.00,
        stock: 9,
        desc: "Oliver Atom sueña con ser el mejor futbolista del mundo y ganar el mundial con su selección. Una historia sobre superación, amistad y deporte.",
        img: "https://res.cloudinary.com/dfhwxnhsl/image/upload/v1770484160/CAPITAN_SUBATSA_nsgwfg.jpg"
    }
];

const cleanText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


function renderBooks(books) {
    catalogGrid.innerHTML = ''; 
    if (books.length === 0) {
        catalogGrid.innerHTML = `<p class="no-results-msg" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron mangas.</p>`;
        return;
    }

    books.forEach(book => {
        const card = `
            <div class="book-card">
                <span class="ev-badge">${book.genre}</span>
                <img src="${book.img}" alt="${book.title}" class="book-cover">
                <div class="book-info-container">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">Autor: ${book.author}</p>
                    <p class="book-desc">${book.desc}</p>
                    <div class="book-meta">
                        <span class="book-price">Precio: ${book.price.toFixed(2)} €</span>
                        <span class="book-stock">En stock: ${book.stock}</span>
                    </div>
                    <button class="btn-add-cart">AÑADIR AL CARRITO</button>
                </div>
            </div>`;
        catalogGrid.innerHTML += card;
    });
}


function filterAndSortBooks() {
    const searchTerm = cleanText(searchInput.value);
    const sortBy = sortBySelect.value;
    let processed = booksData.filter(book => 
        cleanText(book.title).includes(searchTerm) || cleanText(book.author).includes(searchTerm)
    );
    switch(sortBy) {
        case 'title': processed.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'author': processed.sort((a, b) => a.author.localeCompare(b.author)); break;
        case 'price-low': processed.sort((a, b) => a.price - b.price); break;
        case 'price-high': processed.sort((a, b) => b.price - a.price); break;
    }
    renderBooks(processed);
}

searchInput.addEventListener('input', filterAndSortBooks);
sortBySelect.addEventListener('change', filterAndSortBooks);


catalogGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-cart')) {
        const card = e.target.closest('.book-card');
        const title = card.querySelector('.book-title').textContent;
        
        const bookData = booksData.find(b => b.title === title);

        if (bookData) {
            cartItems.push({ title: bookData.title, price: bookData.price });
            
            if (cartCountElement) {
                cartCountElement.textContent = cartItems.length;
            }


            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = "¡AÑADIDO!";
            btn.style.backgroundColor = "#fac746";
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
            }, 800);
        }
    }
});


function actualizarModal() {
    cartItemList.innerHTML = ''; 
    let total = 0;

    if (cartItems.length === 0) {
        cartItemList.innerHTML = '<li style="text-align:center; padding:30px; list-style:none; color:#999;">Tu selección está vacía.</li>';
    } else {
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.padding = "15px 0";
            li.style.borderBottom = "1px solid #eee";
            li.style.listStyle = "none";
            li.innerHTML = `<span>${item.title}</span> <strong>${item.price.toFixed(2)} €</strong>`;
            cartItemList.appendChild(li);
            total += item.price;
        });
    }
    cartTotalAmount.textContent = total.toFixed(2);
}


cartBtn.addEventListener('click', () => {
    actualizarModal();
    cartModal.style.display = 'block';
});


closeModal.addEventListener('click', () => cartModal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.style.display = 'none'; });

btnCheckout.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "📚 *Pedido Universo Otaku*%0A%0A";
    cartItems.forEach(item => {
        mensaje += `• ${item.title} - ${item.price.toFixed(2)} €%0A`;
    });
    const total = cartItems.reduce((acc, i) => acc + i.price, 0).toFixed(2);
    mensaje += `%0ATotal: *${total} €*%0A%0A`;
    mensaje += "👤 Nombre:%0A📍 Dirección:%0A📞 Teléfono:";

    const numeroWhatsApp = "34692253576"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");

    cartItems = [];
    cartCountElement.textContent = '0';
    actualizarModal();
    cartModal.style.display = 'none';
});


renderBooks(booksData);