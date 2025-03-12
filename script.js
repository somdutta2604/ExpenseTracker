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
        let incomeData = new Array(12).fill(0);
        let expenseData = new Array(12).fill(0);
        let transactionHistory = JSON.parse(localStorage.getItem("transactions")) || [];
    
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
    
        function saveTransactions() {
            localStorage.setItem("transactions", JSON.stringify(transactionHistory));
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
    
        function addTransactionToUI(transaction) {
            const historyContainer = transaction.type === "income" ? document.getElementById("income-sec") : document.getElementById("exp-sec");
            if (!historyContainer) return;
    
            const entryTime = new Date();
            const timeId = `time-${Date.now()}`;
            const historyEntry = document.createElement("div");
            historyEntry.innerHTML = `
                <div id="${transaction.type === "income" ? "incomehistory-item" : "expensehistory-item"}">
                    <div class="history-text">
                        <strong>${transaction.category}</strong>
                        <small id="${timeId}">${timeAgo(entryTime)}</small>
                    </div>
                    <div class="history-amount">${transaction.type === "income" ? "+ " : "- "}₹${transaction.amount}</div>
                </div>
            `;
            historyContainer.appendChild(historyEntry);
    
            setTimeout(() => {
                const timeElement = document.getElementById(timeId);
                if (timeElement) timeElement.textContent = timeAgo(entryTime);
            }, 60000);
        }
    
        function loadTransactions() {
            transactionHistory.forEach((txn) => {
                if (txn.type === "income") {
                    totalIncome += txn.amount;
                    monthlyIncome += txn.amount;
                    incomeSources[txn.category] = (incomeSources[txn.category] || 0) + txn.amount;
                } else {
                    totalExpense += txn.amount;
                    monthlyExpense += txn.amount;
                    expenseCategories[txn.category] = (expenseCategories[txn.category] || 0) + txn.amount;
                }
                addTransactionToUI(txn);
            });
            updateTotal();
        }
    
        document.getElementById("add-btn").addEventListener("click", function () {
            const incomeAmount = parseFloat(document.getElementById("amount").value);
            const incDate = document.getElementById("date").value;
            const details = document.getElementById("details").value;
    
            if (isNaN(incomeAmount) || incomeAmount <= 0 || !details || !incDate) {
                alert("Please enter valid details!");
                return;
            }
    
            totalIncome += incomeAmount;
            monthlyIncome += incomeAmount;
            incomeSources[details] = (incomeSources[details] || 0) + incomeAmount;
            updateTotal();
    
            let newTransaction = { type: "income", amount: incomeAmount, date: incDate, category: details };
            transactionHistory.push(newTransaction);
            saveTransactions();
            addTransactionToUI(newTransaction);
    
            document.getElementById("amount").value = "";
            document.getElementById("date").value = "";
            document.getElementById("details").value = "";
    
            let monthIndex = new Date().getMonth();
            updateChart(incomeAmount, 0, monthIndex);
            updateIncomeChart();
        });
    
        document.getElementById("addibtn").addEventListener("click", function () {
            const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
            const expenseDate = document.getElementById("expense-date").value;
            const expenseDetails = document.getElementById("expense-details").value;
    
            if (isNaN(expenseAmount) || expenseAmount <= 0 || !expenseDetails || !expenseDate) {
                alert("Please enter valid details!");
                return;
            }
    
            totalExpense += expenseAmount;
            monthlyExpense += expenseAmount;
            expenseCategories[expenseDetails] = (expenseCategories[expenseDetails] || 0) + expenseAmount;
            updateTotal();
    
            let newTransaction = { type: "expense", amount: expenseAmount, date: expenseDate, category: expenseDetails };
            transactionHistory.push(newTransaction);
            saveTransactions();
            addTransactionToUI(newTransaction);
    
            document.getElementById("expense-amount").value = "";
            document.getElementById("expense-date").value = "";
            document.getElementById("expense-details").value = "";
    
            let monthIndex = new Date().getMonth();
            updateChart(0, expenseAmount, monthIndex);
            updateExpenseChart();
        });
    
        loadTransactions();

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
            datasets: [{
                data: [],
                backgroundColor: ["#A52A2A", "#0000FF", "#008000", "#FF0000"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom"
                }
            }
        }
    });

    const expenseChart = new Chart(expenseCtx, {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom"
                }
            }
        }
    });

    function updateChart(income, expense, monthIndex) {
        incomeData[monthIndex] += income;
        expenseData[monthIndex] += expense;
        chart.data.datasets[0].data = [...incomeData]; 
        chart.data.datasets[1].data = [...expenseData];
        chart.update();
    }

    function updateIncomeChart() {
        incomeChart.data.labels = Object.keys(incomeSources); 
        incomeChart.data.datasets[0].data = Object.values(incomeSources);
        incomeChart.update();
    }
    
    function updateExpenseChart() {
        expenseChart.data.labels = Object.keys(expenseCategories);
        expenseChart.data.datasets[0].data = Object.values(expenseCategories); 
        expenseChart.update();
    }
    
    // Call these functions inside your add income/expense sections
    document.getElementById("add-btn").addEventListener("click", function () {
        updateIncomeChart(); // Update income chart when adding income
    });
    
    document.getElementById("addibtn").addEventListener("click", function () {
        updateExpenseChart();
    });


    //ai insights

    const API_KEY = "AIzaSyC8jOlh8fiIGg2d5W7-M2N3oZxZdbG7jCg";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
    
    async function generateInsights() {
        // Get transaction data dynamically
        let transactionHistory = JSON.parse(localStorage.getItem("transactions")) || [];
    
        if (transactionHistory.length === 0) {
            alert("No transaction data available for analysis!");
            return;
        }
    
        let expenseSummary = {};
        let totalSpent = 0;
    
        transactionHistory.forEach((txn) => {
            if (txn.type === "expense") {
                totalSpent += txn.amount;
                expenseSummary[txn.category] = (expenseSummary[txn.category] || 0) + txn.amount;
            }
        });
    
        if (Object.keys(expenseSummary).length === 0) {
            document.getElementById("ai-output").innerText = "No expense data available for insights.";
            return;
        }
    
        let highestExpenseCategory = Object.keys(expenseSummary).reduce((a, b) => 
            expenseSummary[a] > expenseSummary[b] ? a : b);
    
        let promptText = `My total expenses this month are ₹${totalSpent}. The category I spent the most on is '${highestExpenseCategory}' with ₹${expenseSummary[highestExpenseCategory]}. Suggest ways to reduce my expenses effectively.`;
    
        try {
            let response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });
    
            let data = await response.json();
            console.log("API Response:", data);
    
            if (data.candidates && data.candidates.length > 0) {
                document.getElementById("ai-output").innerText = data.candidates[0].content.parts[0].text;
            } else {
                document.getElementById("ai-output").innerText = "No insights generated.";
            }
        } catch (error) {
            console.error("Error fetching AI insights:", error);
        }
    }
    
    document.querySelector(".analyze-btn").addEventListener("click", generateInsights);
    
    });
    
    
