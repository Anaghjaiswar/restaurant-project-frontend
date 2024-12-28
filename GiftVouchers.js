document.addEventListener('DOMContentLoaded', function () {
    const BASE_URL = "https://restuarant-project-backend.onrender.com/api/gift-vouchers/";
    const PURCHASE_URL = "https://restuarant-project-backend.onrender.com/api/gift-vouchers/purchases/";
    const voucherContainer = document.getElementById('maincontainer');
    const paymentFormContainer = document.getElementById('paymentFormContainer');
    const paymentForm = document.getElementById('paymentForm');
    let selectedVoucher = null;

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

        // Add event listener for Buy Now button
        voucherDiv.querySelector('button').addEventListener('click', function () {
            selectedVoucher = voucher;
            showPaymentForm();
        });

        return voucherDiv;
    }

    function showPaymentForm() {
        paymentFormContainer.style.display = 'block';
    }

    function hidePaymentForm() {
        paymentFormContainer.style.display = 'none';
    }

    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;

        if (!selectedVoucher) {
            alert("No voucher selected!");
            return;
        }

        // Create order on backend
        fetch(PURCHASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                voucher_id: selectedVoucher.id,
                customer_name: customerName,
                customer_email: customerEmail,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.order_id) {
                    initiateRazorpayPayment(data.order_id, data.amount, customerName, customerEmail);
                } else {
                    alert("Failed to create order.");
                }
            })
            .catch(error => {
                console.error("Error creating order:", error);
            });
    });

    function initiateRazorpayPayment(orderId, amount, customerName, customerEmail) {
        const options = {
            key: "rzp_test_B4vS8RodITmf1u", // Replace with your Razorpay key
            amount: amount * 100, // Amount in paise
            currency: "INR",
            name: "LazeezEats",
            description: selectedVoucher.title,
            image: "assets/lazeezEats.jpg",
            order_id: orderId,
            handler: function (response) {
                alert("Payment successful!");
                hidePaymentForm();
                // Handle successful payment: send details to the backend
                fetch(PURCHASE_URL + "confirm/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        order_id: orderId,
                        voucher_id: selectedVoucher.id,
                    }),
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // alert("Purchase completed!");
                            // hidePaymentForm();
                        }
                    })
                    .catch(error => console.error("Error confirming payment:", error));
            },
            prefill: {
                name: customerName,
                email: customerEmail,
            },
            theme: {
                color: "#F37254",
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    // Initial fetch when the page loads
    fetchGiftVouchers();
});
