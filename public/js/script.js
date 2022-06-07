// @ts-check
// for home.ejs

const getMarketURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getDefiCoinsURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-finance-defi&order=market_cap_desc&per_page=70&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getDEXCoinsURL = (page) => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized-exchange&order=market_cap_desc&per_page=70&page="
    + page + "&sparkline=false&price_change_percentage=1h%2C24h%2C7d"

const getGlobalURL = () => "https://api.coingecko.com/api/v3/global"

// for exchange.ejs
const getAllExURL = (page) => "https://api.coingecko.com/api/v3/exchanges?per_page=50&page=" + page

const getOneExURL = (id) => "https://api.coingecko.com/api/v3/exchanges/" + id

const getDerivativesExURL = (page) => "https://api.coingecko.com/api/v3/derivatives/exchanges?order=open_interest_btc_desc&per_page=50&page=" + page

const getBitcoinURL = () => "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=false"

let btcPrice = 0

const getBitcoinData = (url) => { fetch(url).then(res => res.json()).then(data => (btcPrice = (data[0].current_price))).catch(console.error) }

const getSpotExData = (url) => { fetch(url).then(res => res.json()).then(data => loadSpotExDataToTable(data)).catch(console.error) }

const getEx = (id) => fetch(getOneExURL(id)).then(res => res.json())

const getDerivativesExData = (url) => { fetch(url).then(res => res.json()).then(data => loadDerivativesDataToTable(data)).catch(console.error) }

// function to format number to currency(usd) format
const formatDollar = (number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(number)
// function to load global data like total mkc, volume to head
function getGlobalData(url) { fetch(url).then(res => res.json()).then((data) => loadGlobalDataIntoInfoHead(data)).catch(console.error); }
// function to load coins data to table body
async function getCoinsData(url, elementId) { fetch(url).then(async (res) => await res.json()).then((data) => loadCoinsToTable(data, elementId)).catch(console.error) }

//testing optimize

function loadCoinsToTable(data, elementId) {
    let tableBody = document.querySelector("#" + elementId)
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
    let coinFullyDiluted = []

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
        coinFullyDiluted.push(i.fully_diluted_valuation)
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
        html += `<td>${formatDollar(coinFullyDiluted[i])}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html
}

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
        mcap_change.classList.add("text-success")
    } else {
        mcap_change.classList.add("text-danger")
    }
}

// exchange 
const loadSpotExDataToTable = (data) => {
    let tableBody = document.querySelector("#spotEx-table-body")
    let html = ""
    let exRank = []
    let exImage = []
    let exName = []
    let exUrl = []
    let exTrust = []
    let exVol24hNor = []
    let exVol24h = []

    for (let ex of data) {
        exRank.push(ex.trust_score_rank)
        exImage.push(ex.image)
        exName.push(ex.name)
        exUrl.push(ex.url)
        exTrust.push(ex.trust_score)
        exVol24hNor.push(formatDollar(ex.trade_volume_24h_btc_normalized * btcPrice))
        exVol24h.push(formatDollar(ex.trade_volume_24h_btc * btcPrice))
    }

    for (let i = 0; i < exName.length; i++) {
        html += `<tr>`
        html += `<td>${exRank[i]}</td>`
        html += `<td><img class="mx-2" width="20" src="${exImage[i]}"><a class="text-decoration-none" href="${exUrl[i]}" target="_blank">${exName[i]}</a></td>`
        html += `<td>
                    <div class="progress">
                        <div class="progress-bar bg-success" style="width: ${exTrust[i]}0%" role="progressbar" aria-valuemin="0" aria-valuemax="10"></div>
                    </div>${exTrust[i]}
                </td>`
        html += `<td>${exVol24hNor[i]}</td>`
        html += `<td>${exVol24h[i]}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html
}

const loadDerivativesDataToTable = (data) => {
    let tableBody = document.querySelector("#derivativesEx-table-body")
    let html = ""
    let rank = 1

    let exRank = []
    let exImage = []
    let exName = []
    let exUrl = []
    let ex24hOpenInterest = []
    let ex24hVol = []
    let exPerpetuals = []
    let exFutures = []

    for (let ex of data) {
        exRank.push(rank++)
        exImage.push(ex.image)
        exName.push(ex.name)
        exUrl.push(ex.url)
        ex24hOpenInterest.push(formatDollar(ex.open_interest_btc * btcPrice))
        ex24hVol.push(formatDollar(ex.trade_volume_24h_btc * btcPrice))
        exPerpetuals.push(ex.number_of_perpetual_pairs)
        exFutures.push(ex.number_of_futures_pairs)
    }

    for (let y = 0; y < exName.length; y++) {
        html += `<tr>`
        html += `<td>${exRank[y]}</td>`
        html += `<td><img class="mx-2" width="20" src="${exImage[y]}"><a class="text-decoration-none" href="${exUrl[y]}" target="_blank">${exName[y]}</a></td>`
        html += `<td>${ex24hOpenInterest[y]}</td>`
        html += `<td>${ex24hVol[y]}</td>`
        html += `<td>${exPerpetuals[y]}</td>`
        html += `<td>${exFutures[y]}</td>`
        html += `</tr>`
    }
    tableBody.innerHTML = html

}

// dark mode
const classToggle = (el, ...args) => args.map(e => el.classList.toggle(e))
function toggleDarkmode() {
    document.body.classList.toggle("dark-mode")
    document.querySelectorAll("thead").forEach((e) => e.classList.toggle("dark-mode"))
    document.querySelectorAll("tbody").forEach((e) => e.classList.toggle("dark-mode"))
    document.querySelectorAll("a").forEach((e) => e.classList.toggle("dark-mode"))
    document.querySelectorAll("button").forEach((e) => e.classList.toggle("dark-mode"))
    classToggle(document.querySelector("footer"), "bg-light", "bg-dark")
    classToggle(document.querySelector("#dark-mode-icon"), "fa-moon", "fa-sun")
}

// main function
function init() {
    getBitcoinData(getBitcoinURL());
    getGlobalData(getGlobalURL());
    // coins
    getCoinsData(getMarketURL(1), "ranking-table-body");
    getCoinsData(getDefiCoinsURL(1), "defi-table-body");
    getCoinsData(getDEXCoinsURL(1), "dex-table-body");

    // exchanges 
    getSpotExData(getAllExURL(1));
    getDerivativesExData(getDerivativesExURL(1));
}
init()