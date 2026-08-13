const UPI = "ffcarderupta@fam";

const categories = [
  { id: "unsubscribe", name: "Unsubscribe" },
  { id: "craftland", name: "Craftland Bots" },
  { id: "guild", name: "Guild Glory" },
  { id: "diamonds", name: "Free Fire Carding" },
  { id: "redeem", name: "Play Store Redeem Code" }
];

const services = [
  // Unsubscribe
  {
    cat: "unsubscribe",
    name: "Single Unsubscribe",
    desc: "Unsubscribe a single Gmail account",
    meta: "Delivery: 5 minutes",
    price: 600
  },
  {
    cat: "unsubscribe",
    name: "Double Unsubscribe",
    desc: "Unsubscribe a double Gmail account",
    meta: "Delivery: 5 minutes",
    price: 1000
  },

  // Craftland
  {
    cat: "craftland",
    name: "Craftland Followers",
    desc: "₹25 per 50 followers",
    meta: "Limit 200/day • 6hr–24hr",
    price: 25
  },
  {
    cat: "craftland",
    name: "Craftland Followers (Fast Plan)",
    desc: "₹100 per 100 followers",
    meta: "Limit 25k/day • 5min–2hr",
    price: 100
  },
  {
    cat: "craftland",
    name: "Craftland Map Likes",
    desc: "₹50 per 250 likes",
    meta: "Limit 2k/day • 3hr–15hr",
    price: 50
  },
  {
    cat: "craftland",
    name: "Craftland Map Stars",
    desc: "₹30 per 50 stars",
    meta: "Limit 150/day • 6hr–24hr",
    price: 30
  },
  {
    cat: "craftland",
    name: "Craftland Level Up",
    desc: "Craftland account level up",
    meta: "",
    price: 20,
    priceText: "From ₹20"
  },

  // Guild Glory
  {
    cat: "guild",
    name: "Guild Level 7",
    desc: "Guild Glory • Guild level 7",
    meta: "Delivery: 3 days",
    price: 500
  },
  {
    cat: "guild",
    name: "Guild Region Top 15",
    desc: "Guild Glory • Region Top 15",
    meta: "Delivery: 58 hours",
    price: 1400
  },

  // Free Fire diamond delivery
  {
    cat: "diamonds",
    name: "4,000 Diamonds",
    desc: "Free Fire diamond delivery",
    meta: "",
    price: 1000
  },
  {
    cat: "diamonds",
    name: "10,000 Diamonds",
    desc: "Free Fire diamond delivery",
    meta: "",
    price: 2000
  },

  // Play Store Redeem Code
  {
    cat: "redeem",
    name: "₹100 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 100
  },
  {
    cat: "redeem",
    name: "₹500 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 500
  },
  {
    cat: "redeem",
    name: "₹1,000 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 1000
  }
];

let selected = null;
let activeCat = categories[0].id;

function priceLabel(service) {
  if (service.priceText) return service.priceText;

  if (service.price) {
    return "₹" + service.price.toLocaleString("en-IN");
  }

  return "Custom";
}

function renderCards() {
  const grid = document.getElementById("serviceGrid");

  if (!grid) return;

  grid.innerHTML = services
    .map((service, index) => ({ service, index }))
    .filter(({ service }) => service.cat === activeCat)
    .map(({ service, index }) => `
      <article class="card">

        <h3>${service.name}</h3>

        <p>${service.desc}</p>

        ${
          service.meta
            ? `<p class="meta">${service.meta}</p>`
            : ""
        }

        <div class="row">

          <span class="price">
            ${priceLabel(service)}
          </span>

          <button
            class="smallbtn"
            onclick="openCheckout(${index})">
            Buy now
          </button>

        </div>

      </article>
    `)
    .join("");

  const tgNote = document.getElementById("tgContact");

  if (tgNote) {
    tgNote.innerHTML =
      activeCat === "diamonds"
        ? `
          Need help?
          <a
            href="https://t.me/carderffgupta"
            target="_blank"
            rel="noopener">
            Contact Admin on Telegram (@carderffgupta)
          </a>
        `
        : "";
  }
}

function renderNav() {
  const nav = document.getElementById("catNav");

  if (!nav) return;

  nav.innerHTML = categories
    .map(category => `
      <button
        class="cat-btn ${
          category.id === activeCat ? "active" : ""
        }"
        data-cat="${category.id}"
        onclick="selectCategory('${category.id}')">

        ${category.name}

      </button>
    `)
    .join("");
}

function selectCategory(id) {
  activeCat = id;

  renderNav();
  renderCards();
}

document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("serviceGrid");

  if (!grid) {
    console.error("serviceGrid not found");
    return;
  }

  renderNav();
  renderCards();
});

function isUnsubscribe(service) {
  return service && service.cat === "unsubscribe";
}

function openCheckout(index) {
  selected = services[index];

  document.getElementById("checkoutTitle").textContent =
    selected.name;

  document.getElementById("checkoutPrice").textContent =
    priceLabel(selected);

  const idInput =
    document.getElementById("uid");

  const labelText =
    document.getElementById("uidLabelText");

  const playerField =
    document.getElementById("playerField");

  const playerInput =
    document.getElementById("player");

  const playerLabelText =
    document.getElementById("playerLabelText");

  const playerHelp =
    document.getElementById("playerHelp");

  /*
    Unsubscribe:
    Gmail input
  */
  if (isUnsubscribe(selected)) {

    labelText.textContent =
      "Gmail address";

    idInput.value = "";

    idInput.setAttribute(
      "inputmode",
      "email"
    );

    idInput.setAttribute(
      "type",
      "email"
    );

    idInput.setAttribute(
      "placeholder",
      "yourname@gmail.com"
    );

    if (playerField) {
      playerField.style.display = "none";
    }

  } else {

    /*
      All normal game/service orders:
      Free Fire UID
    */

    labelText.textContent =
      "Free Fire UID";

    idInput.value = "";

    idInput.setAttribute(
      "inputmode",
      "numeric"
    );

    idInput.setAttribute(
      "type",
      "text"
    );

    idInput.setAttribute(
      "placeholder",
      "Enter UID"
    );

    if (playerField) {
      playerField.style.display = "";
    }
  }

  if (playerInput) {
    playerInput.value = "";
  }

  /*
    Diamond delivery:
    contact number
  */
  if (selected.cat === "diamonds") {

    playerLabelText.textContent =
      "Contact Number";

    playerInput.setAttribute(
      "type",
      "tel"
    );

    playerInput.setAttribute(
      "inputmode",
      "tel"
    );

    playerInput.setAttribute(
      "placeholder",
      "Enter your WhatsApp/Telegram number"
    );

    playerHelp.textContent =
      "Add your contact number so I can contact you about your order.";

  } else if (selected.cat === "redeem") {

    /*
      Redeem code:
      email/contact for delivery
    */

    playerLabelText.textContent =
      "Email / Contact Number";

    playerInput.setAttribute(
      "type",
      "text"
    );

    playerInput.setAttribute(
      "inputmode",
      "text"
    );

    playerInput.setAttribute(
      "placeholder",
      "Enter email or contact number"
    );

    playerHelp.textContent =
      "Add your contact details for code delivery.";

  } else {

    playerLabelText.textContent =
      "Player name (optional)";

    playerInput.setAttribute(
      "type",
      "text"
    );

    playerInput.setAttribute(
      "inputmode",
      "text"
    );

    playerInput.setAttribute(
      "placeholder",
      "Enter player name"
    );

    playerHelp.textContent = "";
  }

  document
    .getElementById("checkout")
    .classList
    .remove("hidden");
}

function closeCheckout() {
  document
    .getElementById("checkout")
    .classList
    .add("hidden");
}

function showPayment() {
  const value =
    document
      .getElementById("uid")
      .value
      .trim();

  if (isUnsubscribe(selected)) {

    const gmailPattern =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!value) {
      alert("Gmail address enter karo.");
      return;
    }

    if (!gmailPattern.test(value)) {
      alert(
        "Sahi Gmail address enter karo (e.g. yourname@gmail.com)."
      );
      return;
    }

  } else {

    if (!value) {
      alert("Free Fire UID enter karo.");
      return;
    }
  }

  closeCheckout();

  document
    .getElementById("payment")
    .classList
    .remove("hidden");
}

function closePayment() {
  document
    .getElementById("payment")
    .classList
    .add("hidden");
}

function copyUPI() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(UPI);
  }

  alert(
    "UPI ID copied: " + UPI
  );
}

function submitOrder() {
  const utr =
    document
      .getElementById("utr")
      .value
      .trim();

  if (!utr) {
    alert(
      "Payment ke baad UTR / Transaction ID enter karo."
    );
    return;
  }

  document
    .getElementById("status")
    .textContent =
      "Submitted. Your payment is pending manual verification.";
}
