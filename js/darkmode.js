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