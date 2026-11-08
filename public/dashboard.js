// ---------- helpers ----------

async function api(path, method, body) {

    let options = {
        method: method || "GET",
        headers: { "Content-Type": "application/json" }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    let response = await fetch("/api" + path, options);

    return await response.json();

}


function safe(text) {

    let div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ---------- dashboard cards ----------

async function loadSummary() {

    let summary = await api("/summary");

    document.getElementById("totalItems").textContent = summary.totalItems;
    document.getElementById("totalQuantity").textContent = summary.totalQuantity;
    document.getElementById("totalValue").textContent = summary.totalValue.toFixed(2);

}


// ---------- items table ----------

async function loadItems() {

    let items = await api("/items");

    let content = `<div class="empty">No items yet.</div>`;

    if (items.length > 0) {

        let tableRows = items.map(function(item) {

            return `
                <tr>
                    <td>${safe(item.name)}</td>
                    <td>${item.quantity}</td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td>
                        <button class="edit" onclick="editItem(${item.id}, '${safe(item.name)}', ${item.quantity}, ${item.price})">Edit</button>
                        <button class="del" onclick="deleteItem(${item.id})">Delete</button>
                    </td>
                </tr>
            `;

        }).join("");

        content = `
            <table>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
                ${tableRows}
            </table>
        `;

    }

    document.getElementById("content").innerHTML = content;

    loadSummary();

}


// ---------- actions ----------

function editItem(id, name, quantity, price) {

    document.getElementById("id").value = id;
    document.getElementById("name").value = name;
    document.getElementById("quantity").value = quantity;
    document.getElementById("price").value = price;
    document.getElementById("saveBtn").textContent = "Update Item";

}


async function deleteItem(id) {

    await api("/items/" + id, "DELETE");

    loadItems();

}


document.getElementById("form").onsubmit = async function(event) {

    event.preventDefault();

    let id = document.getElementById("id").value;

    let data = {
        name: document.getElementById("name").value,
        quantity: Number(document.getElementById("quantity").value),
        price: Number(document.getElementById("price").value)
    };

    if (id) {
        await api("/items/" + id, "PUT", data);
    } else {
        await api("/items", "POST", data);
    }

    document.getElementById("form").reset();
    document.getElementById("id").value = "";
    document.getElementById("saveBtn").textContent = "Add Item";

    loadItems();

};


loadItems();
