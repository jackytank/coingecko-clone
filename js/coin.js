const getMarketURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getDefiCoinsURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-finance-defi&order=market_cap_desc&per_page=70&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getDEXCoinsURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-exchange&order=market_cap_desc&per_page=70&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getGlobalURL = () => "https://api.coingecko.com/api/v3/global"


// function to format number to currency(usd) format
const formatDollar = (number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(number)

async function getRankingData(url) { await fetch(url).then(res => res.json()).then((data) => loadRankingIntoTable(data)).catch(console.error); }

async function getGlobalData(url) { await fetch(url).then(res => res.json()).then((data) => loadGlobalDataIntoInfoHead(data)).catch(console.error); }

async function getDefiCoinsData(url) { await fetch(url).then(res => res.json()).then(data => loadDefiCoinsToTable(data)).catch(console.error) }

async function getDEXCoinsData(url) { await fetch(url).then(res => res.json()).then(data => loadDEXCoinsToTable(data)).catch(console.error) }

function loadGlobalDataIntoInfoHead(data) {
    let coins = document.querySelector("#coins")
    let exchanges = document.querySelector("#exchanges")
    let marketcap1 = document.querySelector("#marketcap1")
    let volume24h = document.querySelector("#volume24h")

    let marketcap2 = document.querySelector("#marketcap2")
    let mcap_change = document.querySelector("#mcap_change")

    coins.innerHTML = data.data.active_cryptocurrencies
    exchanges.innerHTML = data.data.markets
    marketcap1.innerHTML = formatDollar(data.data.total_market_cap.usd)
    volume24h.innerHTML = formatDollar(data.data.total_volume.usd)

    marketcap2.innerHTML = formatDollar(data.data.total_market_cap.usd).substring(0, 5)
    mcap_change.innerHTML = Math.round(data.data.market_cap_change_percentage_24h_usd * 100) / 100 + "%"
    if (data.data.market_cap_change_percentage_24h_usd > 0) {
        mcap_change.classList = "text-success"
    } else {
        mcap_change.classList = "text-danger"
    }
}

function loadRankingIntoTable(data) {
    let tableBody = document.querySelector("#ranking-table-body")
    let html = ""

    let coinRank = []
    let coinImage = []
    let coinName = []
    let coinPrice = []
    let coinChange1h = []
    let coinChange24h = []
    let coinChange7d = []
    let coinVolume24h = []
    let coinMarketCap = []
    let coinFulldyDiluted = []

    for (let i of data) {
        coinRank.push(i.market_cap_rank)
        coinImage.push(i.image)
        coinName.push(i.name)
        coinPrice.push(i.current_price)
        coinChange1h.push(i.price_change_percentage_1h_in_currency)
        coinChange24h.push(i.price_change_percentage_24h_in_currency)
        coinChange7d.push(i.price_change_percentage_7d_in_currency)
        coinVolume24h.push(i.total_volume)
        coinMarketCap.push(i.market_cap)
        coinFulldyDiluted.push(i.fully_diluted_valuation)
    }

    for (let i = 0; i < coinName.length; i++) {
        html += `<tr>`
        html += `<td>${coinRank[i]}</td>`
        html += `<td><img class="mx-2" width="20" src="${coinImage[i]}">${coinName[i]}</td>`
        html += `<td>${"$" + coinPrice[i]}</td>`
        html += `<td class=${coinChange1h[i] > 0 ? "text-success" : "text-danger"}>${coinChange1h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange24h[i] > 0 ? "text-success" : "text-danger"}>${coinChange24h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange7d[i] > 0 ? "text-success" : "text-danger"}>${coinChange7d[i].toFixed(2) + "%"}</td>`
        html += `<td>${formatDollar(coinVolume24h[i])}</td>`
        html += `<td>${formatDollar(coinMarketCap[i])}</td>`
        html += `<td>${formatDollar(coinFulldyDiluted[i])}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html
}

function loadDefiCoinsToTable(data) {
    let tableBody = document.querySelector("#defi-table-body")
    let html = ""

    let coinRank = []
    let coinImage = []
    let coinName = []
    let coinPrice = []
    let coinChange1h = []
    let coinChange24h = []
    let coinChange7d = []
    let coinVolume24h = []
    let coinMarketCap = []
    let coinFulldyDiluted = []

    let count = 1
    for (let i of data) {
        coinRank.push(count++)
        coinImage.push(i.image)
        coinName.push(i.name)
        coinPrice.push(i.current_price)
        coinChange1h.push(i.price_change_percentage_1h_in_currency)
        coinChange24h.push(i.price_change_percentage_24h_in_currency)
        coinChange7d.push(i.price_change_percentage_7d_in_currency)
        coinVolume24h.push(i.total_volume)
        coinMarketCap.push(i.market_cap)
        coinFulldyDiluted.push(i.fully_diluted_valuation)
    }

    for (let i = 0; i < coinName.length; i++) {
        html += `<tr>`
        html += `<td>${coinRank[i]}</td>`
        html += `<td><img class="mx-2" width="20" src="${coinImage[i]}">${coinName[i]}</td>`
        html += `<td>${"$" + coinPrice[i]}</td>`
        html += `<td class=${coinChange1h[i] > 0 ? "text-success" : "text-danger"}>${coinChange1h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange24h[i] > 0 ? "text-success" : "text-danger"}>${coinChange24h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange7d[i] > 0 ? "text-success" : "text-danger"}>${coinChange7d[i].toFixed(2) + "%"}</td>`
        html += `<td>${formatDollar(coinVolume24h[i])}</td>`
        html += `<td>${formatDollar(coinMarketCap[i])}</td>`
        html += `<td>${formatDollar(coinFulldyDiluted[i])}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html
}

function loadDEXCoinsToTable(data) {
    let tableBody = document.querySelector("#dex-table-body")
    let html = ""

    let coinRank = []
    let coinImage = []
    let coinName = []
    let coinPrice = []
    let coinChange1h = []
    let coinChange24h = []
    let coinChange7d = []
    let coinVolume24h = []
    let coinMarketCap = []
    let coinFulldyDiluted = []

    let count = 1
    for (let i of data) {
        coinRank.push(count++)
        coinImage.push(i.image)
        coinName.push(i.name)
        coinPrice.push(i.current_price)
        coinChange1h.push(i.price_change_percentage_1h_in_currency)
        coinChange24h.push(i.price_change_percentage_24h_in_currency)
        coinChange7d.push(i.price_change_percentage_7d_in_currency)
        coinVolume24h.push(i.total_volume)
        coinMarketCap.push(i.market_cap)
        coinFulldyDiluted.push(i.fully_diluted_valuation)
    }

    for (let i = 0; i < coinName.length; i++) {
        html += `<tr>`
        html += `<td>${coinRank[i]}</td>`
        html += `<td><img class="mx-2" width="20" src="${coinImage[i]}">${coinName[i]}</td>`
        html += `<td>${"$" + coinPrice[i]}</td>`
        html += `<td class=${coinChange1h[i] > 0 ? "text-success" : "text-danger"}>${coinChange1h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange24h[i] > 0 ? "text-success" : "text-danger"}>${coinChange24h[i].toFixed(2) + "%"}</td>`
        html += `<td class=${coinChange7d[i] > 0 ? "text-success" : "text-danger"}>${coinChange7d[i].toFixed(2) + "%"}</td>`
        html += `<td>${formatDollar(coinVolume24h[i])}</td>`
        html += `<td>${formatDollar(coinMarketCap[i])}</td>`
        html += `<td>${formatDollar(coinFulldyDiluted[i])}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html
}

function handleNumberClick(clickedLink, leftArrow, rightArrow) {
    clickedLink.parentElement.classList = "active";
    let clickedLinkPageNumber = parseInt(clickedLink.innerText);
    const url = getMarketURL(clickedLinkPageNumber * 10 - 10);
    getRankingData(url);

    switch (clickedLinkPageNumber) {
        case 1:
            disableLeftArrow(leftArrow);
            if (rightArrow.className.indexOf("disabled") !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
        case 10:
            disableRightArrow(rightArrow);
            if (leftArrow.className.indexOf("disabled") !== -1) {
                enableLeftArrow(leftArrow);
            }
            break;
        default:
            if (leftArrow.className.indexOf("disabled") !== -1) {
                enableLeftArrow(leftArrow);
            }
            if (rightArrow.className.indexOf("disabled") !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
    }
}

function handleLeftArrowClick(activePageNumber, leftArrow, rightArrow) {
    //move to previous page
    let previousPage = document.querySelectorAll("li")[activePageNumber - 1];
    previousPage.classList = "active";
    url = getMarketURL((activePageNumber - 1) * 10 - 10);
    getRankingData(url);

    if (activePageNumber === 10) {
        enableRightArrow(rightArrow);
    }

    if (activePageNumber - 1 === 1) {
        disableLeftArrow(leftArrow);
    }
}

function handleRightArrowClick(activePageNumber, leftArrow, rightArrow) {
    //move to next page
    let nextPage = document.querySelectorAll("li")[activePageNumber + 1];
    nextPage.classList = "active";

    url = getMarketURL((activePageNumber + 1) * 10 - 10);
    getRankingData(url);

    if (activePageNumber === 1) {
        enableLeftArrow(leftArrow);
    }

    if (activePageNumber + 1 === 10) {
        disableRightArrow(rightArrow);
    }
}

function disableLeftArrow(leftArrow) {
    leftArrow.classList = "disabled";
}

function enableLeftArrow(leftArrow) {
    leftArrow.classList = "";
}

function disableRightArrow(rightArrow) {
    rightArrow.classList = "disabled";
}

function enableRightArrow(rightArrow) {
    rightArrow.classList = "";
}

//handle pagination
let pageLinks = document.querySelectorAll("a");
let activePageNumber;
let clickedLink;
let leftArrow;
let rightArrow;
let url = "";

pageLinks.forEach((element) => {
    element.addEventListener("click", function () {
        leftArrow = document.querySelector(".arrow-left");
        rightArrow = document.querySelector(".arrow-right");
        console.log(rightArrow);
        activeLink = document.querySelector(".active");

        //get active page number
        activePageNumber = parseInt(activeLink.innerText);

        if (
            (this.innerText === "chevron_left" && activePageNumber === 1) ||
            (this.innerText === "chevron_right" && activePageNumber === 10)
        ) {
            return;
        }

        //update active class
        activeLink.classList = "page-item";

        if (this.innerText === "chevron_left") {
            handleLeftArrowClick(activePageNumber, leftArrow, rightArrow);
        } else if (this.innerText === "chevron_right") {
            handleRightArrowClick(activePageNumber, leftArrow, rightArrow);
        } else {
            handleNumberClick(this, leftArrow, rightArrow);
        }
    });
});



function init() {
    const ticketUrl = getMarketURL(1)
    const globalUrl = getGlobalURL()
    const deficoinUrl = getDefiCoinsURL(1)
    const dexcoinUrl = getDEXCoinsURL(1)
    getRankingData(ticketUrl);
    getGlobalData(globalUrl);
    getDefiCoinsData(deficoinUrl)
    getDEXCoinsData(dexcoinUrl)
}

init();