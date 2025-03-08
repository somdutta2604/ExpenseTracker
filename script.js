document.addEventListener("DOMContentLoaded", function () {
    function Show() {
        let menuIcon = document.querySelector(".menu-icon");
        let closeIcon = document.querySelector(".close-icon");
        let navLinks = document.querySelector(".nav-links");

        if (navLinks.style.display === "flex") {
            navLinks.style.display = "none";
            menuIcon.style.display = "inline";
            closeIcon.style.display = "none";
        } else {
            navLinks.style.display = "flex";
            menuIcon.style.display = "none";
            closeIcon.style.display = "inline";
        }
    }

    document.querySelector(".hamburger").addEventListener("click", Show);

    let totalBalance = 0;
    let totalExpense = 0;
    let totalIncome = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let incomeSources = {};
    let expenseCategories = {};

    function updateTotal() {
        totalBalance = totalIncome - totalExpense;
        const totalAmt = document.getElementById("totalamount");

        if (totalAmt) {
            totalAmt.innerText = `₹${totalBalance}/-`;
            totalAmt.style.display = "block";
            totalAmt.style.visibility = "visible";
            totalAmt.style.fontWeight = "100";
            totalAmt.style.color = "white";
        }
    }

    function timeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        if (seconds < 60) return `${seconds} sec ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hrs ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    }

    // Add income
    document.getElementById("add-btn").addEventListener("click", function () {
        const incomeAmount = parseFloat(document.getElementById("amount").value);
        const incDate = document.getElementById("date").value;
        const details = document.getElementById("details").value;

        if (isNaN(incomeAmount) || incomeAmount <= 0 || !details || !incDate) {
            alert("Please enter valid details!");
            return;
        }

        const dashIncome = document.getElementById("incamount");
        if (!dashIncome) return;

        let currentIncome = parseFloat(dashIncome.textContent.replace("₹", "")) || 0;
        dashIncome.textContent = `₹${currentIncome + incomeAmount}/-`;
        dashIncome.style.display = "block";
        dashIncome.style.visibility = "visible";
        dashIncome.style.color = "white";
        dashIncome.style.fontWeight = "100";

        totalIncome += incomeAmount;
        monthlyIncome += incomeAmount;
        incomeSources[details] = (incomeSources[details] || 0) + incomeAmount;
        updateTotal();

        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        document.getElementById("details").value = "";

        const historyContainer = document.getElementById("income-sec");
        if (!historyContainer) return;

        const entryTime = new Date();
        const timeId = `time-${Date.now()}`;
        const historyEntry = document.createElement("div");
        historyEntry.innerHTML = `
            <div id="incomehistory-item">
                <div class="history-text">
                    <strong>${details}</strong>
                    <small id="${timeId}">${timeAgo(entryTime)}</small>
                </div>
                <div class="history-amount">+ ₹${incomeAmount}</div>
            </div>
        `;
        historyContainer.appendChild(historyEntry);

        setTimeout(() => {
            const timeElement = document.getElementById(timeId);
            if (timeElement) timeElement.textContent = timeAgo(entryTime);
        }, 60000);

        let monthIndex = new Date().getMonth();
        updateChart(incomeAmount, 0, monthIndex);
    });

    // Add expense
    document.getElementById("addibtn").addEventListener("click", function () {
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseDate = document.getElementById("expense-date").value;
        const expenseDetails = document.getElementById("expense-details").value;

        if (isNaN(expenseAmount) || expenseAmount <= 0 || !expenseDetails || !expenseDate) {
            alert("Please enter valid details!");
            return;
        }

        const dashExpense = document.getElementById("expamount");
        if (!dashExpense) return;

        let currentExpense = parseFloat(dashExpense.textContent.replace("₹", "")) || 0;
        dashExpense.textContent = `₹${currentExpense + expenseAmount}/-`;
        dashExpense.style.display = "block";
        dashExpense.style.visibility = "visible";
        dashExpense.style.color = "white";
        dashExpense.style.fontWeight = "100";

        totalExpense += expenseAmount;
        monthlyExpense += expenseAmount;
        expenseCategories[expenseDetails] = (expenseCategories[expenseDetails] || 0) + expenseAmount;
        updateTotal();

        document.getElementById("expense-amount").value = "";
        document.getElementById("expense-date").value = "";
        document.getElementById("expense-details").value = "";

        const exphistoryContainer = document.getElementById("exp-sec");
        if (!exphistoryContainer) return;

        const entryTime = new Date();
        const timeId = `time-${Date.now()}`;
        const exphistoryEntry = document.createElement("div");
        exphistoryEntry.innerHTML = `
            <div id="expensehistory-item">
                <div class="history-text" id="exphist-text">
                    <strong>${expenseDetails}</strong>
                    <small id="${timeId}">${timeAgo(entryTime)}</small>
                </div>
                <div class="history-amount">- ₹${expenseAmount}</div>
            </div>
        `;
        exphistoryContainer.appendChild(exphistoryEntry);

        setTimeout(() => {
            const timeElement = document.getElementById(timeId);
            if (timeElement) timeElement.textContent = timeAgo(entryTime);
        }, 60000);

        
        let monthIndex = new Date().getMonth();
        updateChart(0, expenseAmount, monthIndex);
        
    });

    // Charts
    const ctx = document.getElementById("dashboardChart").getContext("2d");
    const incomeCtx = document.getElementById("incomeChart").getContext("2d");
    const expenseCtx = document.getElementById("expenseChart").getContext("2d");

    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                { label: "Income", data: incomeData, backgroundColor: "rgba(34, 139, 34, 1)", borderRadius: 5 },
                { label: "Expenses", data: expenseData, backgroundColor: "rgba(255, 99, 71, 1)", borderRadius: 5 }
            ]
        },
        options: {
            responsive: true,
            scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
            plugins: { legend: { display: true } }
        }
    });

    const incomeChart = new Chart(incomeCtx, {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{ data: [], backgroundColor: ["#A52A2A", "#0000FF", "#008000", "#FF0000"] }]
        }
    });

    const expenseChart = new Chart(expenseCtx, {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{ data: [], backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"] }]
        }
    });

    function updateChart(income, expense, monthIndex) {
        incomeData[monthIndex] += income;
        expenseData[monthIndex] += expense;
        chart.update();
    }
});

