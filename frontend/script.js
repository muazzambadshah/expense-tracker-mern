const API = "http://localhost:5000/api";
let token = localStorage.getItem("token");
let chart;

if (!token && location.pathname.includes("dashboard")) {
    location.href = "login.html";
}

async function login() {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    });

    const data = await res.json();

    if (!data.token) return alert("Login failed");

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
}

async function register() {
    await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: regUsername.value,
            email: regEmail.value,
            password: regPassword.value
        })
    });

    alert("Registered successfully!");
}

function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
}

async function addExpense() {
    await fetch(`${API}/expenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            title: title.value,
            amount: Number(amount.value),
            category: category.value
        })
    });

    loadExpenses();
}

async function deleteExpense(id) {
    await fetch(`${API}/expenses/${id}`, {
        method: "DELETE",
        headers: {"Authorization": token}
    });

    loadExpenses();
}

async function editExpense(id, t, a, c) {
    let titleVal = prompt("Edit Title", t);
    let amountVal = prompt("Edit Amount", a);
    let categoryVal = prompt("Edit Category", c);

    await fetch(`${API}/expenses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            title: titleVal,
            amount: Number(amountVal),
            category: categoryVal
        })
    });

    loadExpenses();
}

async function loadExpenses() {
    const res = await fetch(`${API}/expenses`, {
        headers: {"Authorization": token}
    });

    const data = await res.json();

    let total = 0;
    let monthly = 0;
    let currentMonth = new Date().getMonth();

    list.innerHTML = "";

    data.forEach(e => {
        total += e.amount;

        if (new Date(e.date).getMonth() === currentMonth)
            monthly += e.amount;

        list.innerHTML += `
        <li>
            ${e.title} - ${e.amount}
            <button onclick="deleteExpense('${e._id}')">❌</button>
            <button onclick="editExpense('${e._id}','${e.title}',${e.amount},'${e.category}')">✏️</button>
        </li>`;
    });

    totalEl.innerText = total;
    monthlyEl.innerText = monthly;

    let budget = Number(localStorage.getItem("budget")) || 0;
    document.getElementById("budget").innerText = budget;

    if (budget > 0 && total > budget) {
        alert("⚠️ Budget exceeded!");
    }

    drawChart(data);
}

function drawChart(expenses) {
    let categories = {};

    expenses.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories)
            }]
        }
    });
}

function setBudget() {
    localStorage.setItem("budget", budgetInput.value);
}
function toggleTheme() {
    document.body.classList.toggle("light");
}
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const res = await fetch(`${API}/expenses`, {
        headers: {"Authorization": token}
    });

    const data = await res.json();

    let y = 10;
    data.forEach(e => {
        doc.text(`${e.title} - ${e.amount}`, 10, y);
        y += 10;
    });

    doc.save("report.pdf");
}
function uploadImage(e) {
    const reader = new FileReader();
    reader.onload = () => {
        localStorage.setItem("profilePic", reader.result);
        document.getElementById("profilePic").src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}
window.onload = () => {
    const img = localStorage.getItem("profilePic");
    if (img && img !== "null") {
        document.getElementById("profilePic").src = img;
    }

    if (location.pathname.includes("dashboard")) {
        loadExpenses();
    }
};