document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://restuarant-project-backend.onrender.com/api/gift-vouchers/";
    const voucherContainer = document.getElementById('maincontainer');

    // Fetch gift vouchers from API
    function fetchGiftVouchers() {
        fetch(BASE_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch gift vouchers");
                }
                return response.json();
            })
            .then(data => {
                renderGiftVouchers(data);
            })
            .catch(error => {
                console.error("Error fetching gift vouchers: ", error);
            });
    }

    // Render gift vouchers dynamically
    function renderGiftVouchers(vouchers) {
        voucherContainer.innerHTML = ''; // Clear existing content
        vouchers.forEach(voucher => {
            const voucherElement = createVoucherElement(voucher);
            voucherContainer.appendChild(voucherElement);
        });
    }

    // Create a single voucher element
    function createVoucherElement(voucher) {
        const voucherDiv = document.createElement('div');
        voucherDiv.classList.add('boxex');

        voucherDiv.innerHTML = `
            <img src="${voucher.image}" alt="${voucher.title}"><br>
            <h2 class="underline-heading title">${voucher.title}</h2>
            <p>From <span class="price">${voucher.price}</span>rs</p>
            <p class="description">${voucher.description}</p>
            <button>Buy Now</button>
        `;
        return voucherDiv;
    }

    // Initial fetch when the page loads
    fetchGiftVouchers();
});
