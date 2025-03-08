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
    let balance = []
    let income = 0;
 
    //add income
    document.getElementById("add-btn").addEventListener("click", function () {
        const incomeAmount = parseFloat(document.getElementById("amount").value);
        const incDate = document.getElementById("date").value;
        const details = document.getElementById("details").value;   
    
        if (isNaN(incomeAmount) || incomeAmount <= 0 || !details || !incDate) {
            alert("Please enter valid details!");
            return;
        }   
    
        const dashIncome = document.getElementById("incamount");    
        if (!dashIncome) {
            console.error("Element with ID 'incamount' not found!");
            return;
        }    
    
        let currentIncome = parseFloat(dashIncome.textContent.replace("₹", "")) || 0;
        dashIncome.textContent = `₹${currentIncome + incomeAmount}/-`;
        document.getElementById("incamount").style.display = "block";
        document.getElementById("incamount").style.visibility = "visible";
        document.getElementById("incamount").style.color = "white";
        document.getElementById("incamount").style.fontWeight = "100";
    
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        document.getElementById("details").value = "";
    
        const historyContainer = document.getElementById("incomehistory-item");
        if (!historyContainer) {
            console.error("Element with ID 'incomehistory-item' not found!");
            return;
        }
    
        console.log("Adding to history:", details, incomeAmount); 
    
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
    
        const historyEntry = document.createElement("div");
        historyEntry.classList.add("history-entry");
        
        historyEntry.innerHTML = `
            <div class="history-text">
                <strong>${details}</strong>
                <small>${timeAgo(new Date())}</small>
            </div>
            <div class="history-amount">+ ₹${incomeAmount}</div>
        `;
    
        historyContainer.appendChild(historyEntry);

        document.getElementById("incomehistory-item").style.display = "block";
        document.getElementById("incomehistory-item").style.visibility = "visible";
        document.getElementById("incomehistory-item").style.color = "white";
        document.getElementById("incomehistory-item").style.fontWeight = "100";

    });
    
})

    //    document.getElementById("incamount").style.display = "block";
    //     document.getElementById("incamount").style.visibility = "visible";
    //     document.getElementById("incamount").style.color = "white";
    //     document.getElementById("incamount").style.fontWeight = "100";