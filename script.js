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
            datasets: [{ data: [], backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F1C40F"] }]
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

    //AIzaSyAULsKyoyUyAbVTwZiWFynAzFaXuT82ByM
        const API_KEY = "YOUR_SECURED_API_KEY";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
     
        async function generateInsights() {
            const totalIncome = Object.values(incomeSources).reduce((a, b) => a + b, 0);
            const totalExpense = Object.values(expenseCategories).reduce((a, b) => a + b, 0);
            const savings = totalIncome - totalExpense;
        
            const incomeSummary = Object.entries(incomeSources)
                .map(([source, amount]) => `${source}: ₹${amount}`)
                .join(", ");
            const expenseSummary = Object.entries(expenseCategories)
                .map(([category, amount]) => `${category}: ₹${amount}`)
                .join(", ");
        
            const prompt = `Analyze the following financial data and provide insights to optimize expenses and increase savings in 3 lines.
        
            **Income Sources:**
            ${incomeSummary}  
            **Total Income:** ₹${totalIncome}
        
            **Expense Categories:**
            ${expenseSummary}  
            **Total Expenses:** ₹${totalExpense}
        
            **Savings:** ₹${savings}
        
            Based on this data, suggest actionable strategies to:
            1. Reduce unnecessary expenses
            2. Improve savings and budgeting
            3. Optimize income allocation`;
        
            try {
                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
        
                const data = await response.json();
                const aiResponse = data.candidates[0].content.parts[0].text;
                
                document.getElementById("ai-output").innerText = aiResponse;
            } catch (error) {
                console.error("Error fetching AI insights:", error);
                document.getElementById("ai-output").innerText = "Error generating insights. Please try again.";
            }
        }
        
            function generateExpensePrompt() {
            let totalExpense = 0;
            let expenseCategories = {};
        
            transactionHistory.forEach(txn => {
                if (txn.type === "expense") {
                    totalExpense += txn.amount;
                    expenseCategories[txn.category] = (expenseCategories[txn.category] || 0) + txn.amount;
                }
            });
        
            const expenseSummary = Object.entries(expenseCategories)
                .map(([category, amount]) => `${category}: ₹${amount}`)
                .join(", ");
        
            return `Based on the following expenses, identify areas where spending can be reduced:
        
            **Expense Categories:**
            ${expenseSummary}
        
            **Total Expenses:** ₹${totalExpense}
        
            Suggest **ONLY the top 3 ways to cut down unnecessary spending.** Keep it short and direct.`;
        }
        
    });
    
    
