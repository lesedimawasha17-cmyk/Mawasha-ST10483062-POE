const RECIPIENT = "jackysrestaurant@gmail.com";

const pricePerPerson = {
"Private function": 250,
"Catering": 180,
"Birthday or celebration": 220,
"Large group booking": 150
};

const extraPrices = {
"Decorations": 500,
"Celebration cake": 350,
"Music or DJ": 1200,
"Special dietary meals": 200
};

function initMenuTabs() {
const tabLabels = document.querySelectorAll(".tab-labels label");
const tabPanels = document.querySelectorAll(".tab-panel");
if (tabLabels.length === 0) return;

tabLabels.forEach(function (label) {
label.addEventListener("click", function () {
tabLabels.forEach(l => l.classList.remove("active"));
tabPanels.forEach(p => p.classList.remove("active"));

label.classList.add("active");
document.getElementById("panel-" + label.getAttribute("data-tab")).classList.add("active");
});
});
}

function searchItems() {
const input = document.getElementById("menu-search-input");
const filter = input.value.toLowerCase();
const items = document.querySelectorAll(".menu-card");
const menuTabs = document.getElementById("menu-tabs");
const noResults = document.getElementById("no-results");

if (filter === "") {
items.forEach(item => item.classList.remove("hidden"));
menuTabs.classList.remove("searching");
noResults.style.display = "none";
return;
}

menuTabs.classList.add("searching");
let matchCount = 0;

items.forEach(item => {
const text = item.querySelector("h3").textContent.toLowerCase();
if (text.includes(filter)) {
item.classList.remove("hidden");
matchCount++;
} else {
item.classList.add("hidden");
}
});

noResults.style.display = matchCount === 0 ? "block" : "none";
}

function initMenuSearch() {
const searchInput = document.getElementById("menu-search-input");
if (!searchInput) return;
searchInput.addEventListener("input", searchItems);
}

function initGallery() {
const galleryImages = document.querySelectorAll(".gallery-grid img");
const overlay = document.getElementById("lightbox-overlay");
if (galleryImages.length === 0 || !overlay) return;

const overlayImg = document.getElementById("lightbox-img");
const caption = document.getElementById("lightbox-caption");
const closeBtn = document.getElementById("lightbox-close");

galleryImages.forEach(function (img) {
img.addEventListener("click", function () {
overlayImg.src = img.src;
overlayImg.alt = img.alt;
if (caption) caption.textContent = img.alt;
overlay.classList.add("open");
});
});

function closeLightbox() {
overlay.classList.remove("open");
overlayImg.src = "";
if (caption) caption.textContent = "";
}

closeBtn.addEventListener("click", closeLightbox);

overlay.addEventListener("click", function (e) {
if (e.target === overlay) {
closeLightbox();
}
});

document.addEventListener("keydown", function (e) {
if (e.key === "Escape") {
closeLightbox();
}
});
}

function setError(id, message) {
document.getElementById(id).textContent = message;
}

function clearErrors() {
document.querySelectorAll("#enquiry-form .error").forEach(e => e.textContent = "");
}

function validateEnquiry(event) {
event.preventDefault();
clearErrors();
document.getElementById("enquiry-response").classList.remove("show");

const name = document.getElementById("enq-name").value.trim();
const email = document.getElementById("enq-email").value.trim();
const phone = document.getElementById("enq-phone").value.replace(/\s/g, "");
const type = document.getElementById("enq-type").value;
const guests = parseInt(document.getElementById("enq-guests").value);
const date = document.getElementById("enq-date").value;
const message = document.getElementById("enq-message").value.trim();

let valid = true;

if (name.length < 2 || name.length > 50) {
setError("err-name", "Please enter your full name (2 to 50 characters).");
valid = false;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
setError("err-email", "Please enter a valid email address, e.g. name@example.com.");
valid = false;
}

if (!/^0\d{9}$/.test(phone)) {
setError("err-phone", "Phone number must be 10 digits and start with 0.");
valid = false;
}

if (type === "") {
setError("err-type", "Please choose what your enquiry is about.");
valid = false;
}

if (isNaN(guests) || guests < 1 || guests > 200) {
setError("err-guests", "Number of guests must be between 1 and 200.");
valid = false;
}

if (date === "") {
setError("err-date", "Please choose a preferred date.");
valid = false;
} else if (new Date(date) < new Date(new Date().toDateString())) {
setError("err-date", "The date cannot be in the past.");
valid = false;
}

if (message.length < 10 || message.length > 300) {
setError("err-message", "Message must be between 10 and 300 characters.");
valid = false;
}

if (valid) {
showResponse(name, type, guests, date);
}
}

function showResponse(name, type, guests, date) {
const checked = document.querySelectorAll('input[name="extras"]:checked');
let extrasTotal = 0;
let extrasList = [];

checked.forEach(function (box) {
extrasTotal += extraPrices[box.value];
extrasList.push(box.value);
});

const total = guests * pricePerPerson[type] + extrasTotal;
const day = new Date(date).getUTCDay();

let availability;
if (day === 5 || day === 6) {
availability = "Fridays and Saturdays are our busiest days. Availability is limited and a deposit is required to hold the date.";
} else {
availability = "Good news, we currently have availability on your chosen date.";
}

if (guests > 100) {
availability += " For more than 100 guests we need at least 14 days' notice.";
}

document.getElementById("resp-title").textContent = "Thank you, " + name + "!";
document.getElementById("resp-cost").textContent =
"Estimated cost for " + guests + " guests (" + type + "): R" + total.toLocaleString("en-ZA") +
" (R" + pricePerPerson[type] + " per person" +
(extrasTotal > 0 ? " plus R" + extrasTotal.toLocaleString("en-ZA") + " for extras" : "") + ").";
document.getElementById("resp-extras").textContent =
extrasList.length > 0 ? "Extras included: " + extrasList.join(", ") + "." : "No extras selected.";
document.getElementById("resp-avail").textContent = availability;

document.getElementById("enquiry-response").classList.add("show");
document.getElementById("enquiry-form").reset();
}

function initEnquiry() {
const form = document.getElementById("enquiry-form");
if (!form) return;

const today = new Date().toISOString().split("T")[0];
document.getElementById("enq-date").setAttribute("min", today);

form.addEventListener("submit", validateEnquiry);
}

function setErr(id, msg) {
document.getElementById(id).textContent = msg;
}

function clearErrs() {
document.querySelectorAll("#contact-form .error").forEach(e => e.textContent = "");
}

function validateContact(event) {
event.preventDefault();
clearErrs();
document.getElementById("contact-response").classList.remove("show");

const name = document.getElementById("c-name").value.trim();
const email = document.getElementById("c-email").value.trim();
const phone = document.getElementById("c-phone").value.replace(/\s/g, "");
const type = document.getElementById("c-type").value;
const replyChoice = document.querySelector('input[name="reply"]:checked');
const message = document.getElementById("c-message").value.trim();
const consent = document.getElementById("c-consent").checked;

let valid = true;

if (name.length < 2 || name.length > 50) {
setErr("c-err-name", "Please enter your full name (2 to 50 characters).");
valid = false;
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
setErr("c-err-email", "Please enter a valid email address, e.g. name@example.com.");
valid = false;
}
if (!/^0\d{9}$/.test(phone)) {
setErr("c-err-phone", "Phone number must be 10 digits and start with 0.");
valid = false;
}
if (type === "") {
setErr("c-err-type", "Please choose a type of message.");
valid = false;
}
if (!replyChoice) {
setErr("c-err-reply", "Please choose how we should reply.");
valid = false;
}
if (message.length < 10 || message.length > 500) {
setErr("c-err-message", "Message must be between 10 and 500 characters.");
valid = false;
}
if (!consent) {
setErr("c-err-consent", "Please tick the box to agree to be contacted.");
valid = false;
}

if (valid) {
buildEmail(name, email, phone, type, replyChoice.value, message);
}
}

function buildEmail(name, email, phone, type, reply, message) {
const subject = "Website message: " + type;
const body =
"Name: " + name + "\n" +
"Email: " + email + "\n" +
"Phone: " + phone + "\n" +
"Type of message: " + type + "\n" +
"Preferred reply: " + reply + "\n\n" +
"Message:\n" + message;

const link = "mailto:" + RECIPIENT +
"?subject=" + encodeURIComponent(subject) +
"&body=" + encodeURIComponent(body);

document.getElementById("contact-preview").textContent =
"To: " + RECIPIENT + " | Subject: " + subject + " | From: " + name + " (" + email + ")";
document.getElementById("contact-send").setAttribute("href", link);
document.getElementById("contact-response").classList.add("show");
}

function initContact() {
const form = document.getElementById("contact-form");
if (!form) return;
form.addEventListener("submit", validateContact);
}

document.addEventListener("DOMContentLoaded", function () {
initMenuTabs();
initMenuSearch();
initGallery();
initEnquiry();
initContact();
});