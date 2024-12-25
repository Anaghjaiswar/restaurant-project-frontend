document.addEventListener('DOMContentLoaded', function() {
    const BASE_URL = "https://restuarant-project-backend.onrender.com";
    const menuDishContainer = document.getElementById('menu-dish-container');
    const addDishButton = document.getElementById('add-dish-button');

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

    // inner setup
    fetchMenus();
    addMenuDishListeners(document.querySelector(".menu-dish-group"));
});