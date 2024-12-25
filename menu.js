document.addEventListener('DOMContentLoaded', function() {
    const menus = document.querySelectorAll('.menu');
    const BASE_URL = "https://restuarant-project-backend.onrender.com/";
    menus.forEach(menu => {
        const menuId = menu.getAttribute('data-menu-id');
        const tbody = menu.querySelector('tbody');


        fetch(`${BASE_URL}api/menu/${menuId}/dishes/`)
        .then(response => {
            if (!response.ok){
                throw new Error('Failed to fetch dishes for menu ID : ${menuId}');
            }
            return response.json();
        })
        .then(dishes => {
            tbody.innerHTML = '';

            dishes.forEach(dish => {
                const row = `
                    <tr>
                        <td>${dish.name}</td>
                        <td>${dish.description}</td>
                        <td>${dish.price}</td>
                    </tr>   
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error(error);
            tbody.innerHTML = `
                <tr>
                    td colspan="3">Failed to load dishes for menu ID: ${menuId}
                </td>
            `;
        });
    });
});