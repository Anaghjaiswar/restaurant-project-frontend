document.addEventListener('DOMContentLoaded', function() {
    const BASE_URL = "https://restuarant-project-backend.onrender.com";
    const menuDishContainer = document.getElementById('menu-dish-container');
    const addDishButton = document.getElementById('add-dish-button');
    const orderForm = document.getElementById('order-form');


    // Fetch all menus from API
    function fetchMenus() {
        fetch(`${BASE_URL}/api/menu/`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            populateMenuOptions(data)})
        .catch(error => console.error("Error fetching menus: ", error));
    }

    // Populate the menu select dropdown
    function populateMenuOptions(menus) {
        document.querySelectorAll('.menu-select').forEach(menuSelect => {
            menuSelect.innerHTML = '<option value="">Select a menu</option>';
            menus.forEach(menu => {
                const option = document.createElement("option");
                option.value = menu.id;
                option.textContent = menu.category_name;
                menuSelect.appendChild(option);
            });
        });
    }

    // Fetch dishes based on selected menu
    function fetchDishes(menuId, dishSelect){
        fetch(`${BASE_URL}/api/menu/${menuId}/dishes/`)
        .then(response => response.json())  
        .then(data => populateDishOptions(data, dishSelect))
        .catch(error => console.error("Error fetching dishes: ", error));
    }

    // Populate the dish select dropdown
    function populateDishOptions(dishes, dishSelect){
        dishSelect.innerHTML = '<option value="">Select a dish</option>';
        dishes.forEach(dish => {
            const option = document.createElement("option");
            option.value = dish.id;
            option.textContent = `${dish.name} - ₹${dish.price}`;
            dishSelect.appendChild(option);
        });
    }

    // add event listener to menu and dish select dropdowns
    function addMenuDishListeners(group) {
        const menuSelect = group.querySelector(".menu-select");
        const dishSelect = group.querySelector(".dish-select");

        menuSelect.addEventListener("change", () => {
            if (menuSelect.value) {
                fetchDishes(menuSelect.value, dishSelect);
            } else {
                dishSelect.innerHTML = '<option value="">Select Dish</option>';
            }
        });
    }

    // add new menu-dish group
    addDishButton.addEventListener("click", () => {
        const newGroup = document.querySelector(".menu-dish-group").cloneNode(true);

        // Clear input fields
        newGroup.querySelector(".menu-select").value = "";
        newGroup.querySelector(".dish-select").innerHTML = '<option value="">Select Dish</option>';
        newGroup.querySelector(".quantity").value = "";
        newGroup.querySelector(".special-requests").value = "";

        // Add event listeners for the new group
        addMenuDishListeners(newGroup);

        // Append to container
        menuDishContainer.appendChild(newGroup);
    });



    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const contactNumber = document.getElementById('contact-number').value;
        const email = document.getElementById('email').value;
        const menuDishGroups = document.querySelectorAll('.menu-dish-group');

        // Collect all menu-dish group details
        const orderItems = [];
        menuDishGroups.forEach(group => {
            const menuId = group.querySelector('.menu-select').value;
            const dishId = group.querySelector('.dish-select').value;
            const quantity = group.querySelector('.quantity').value;
            const specialRequests = group.querySelector('.special-requests').value;

            if (menuId && dishId && quantity) {
                orderItems.push({
                    menu_id: menuId,
                    dish_id: dishId,
                    quantity: parseInt(quantity, 10),
                    special_requests: specialRequests
                });
            }
        });

        const orderData = {
            email: email,
            contact_number: contactNumber,
            order_items: orderItems
        };

        // Send the order data to the backend
        fetch(`${BASE_URL}/api/menu/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.razorpay_order_id) {
                // Initialize Razorpay payment
                const options = {
                    key: "rzp_test_B4vS8RodITmf1u",
                    amount: data.amount * 100, // Amount in paise
                    currency: "INR",
                    name: "LazeezEats",
                    image: "assets/lazeezEats.jpg",
                    description: "Food Order",
                    order_id: data.razorpay_order_id,
                    handler: function(response) {
                        // alert("Payment successful!");
                        orderForm.reset();
                        fetch(`${BASE_URL}/api/menu/orders/confirm/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                            })
                        })
                        .then(response => response.json())
                        .then(confirmData => {
                            alert(confirmData.message);
                            // orderForm.reset();
                        });
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };
                const rzp = new Razorpay(options);
                rzp.open();
            } else {
                alert(`Failed to create Razorpay order: ${data.error}`);
            }
        })
        .catch(error => console.error("Error placing order: ", error));
    });

    // inner setup
    fetchMenus();
    addMenuDishListeners(document.querySelector(".menu-dish-group"));
});