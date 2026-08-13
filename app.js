const SUPABASE_URL = "https://wlldnjdgnqnnwtdakkbg.supabase.co";
const SUPABASE_KEY = "sb_publishable_LRDs-toBVkcc0tfhts_stA_mirTYqPz";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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

  // Free Fire Carding / Diamond Delivery
  {
    cat: "diamonds",
    name: "4,000 Diamonds",
    desc: "Free Fire diamond delivery",
    meta: "Manual delivery",
    price: 1000
  },
  {
    cat: "diamonds",
    name: "10,000 Diamonds",
    desc: "Free Fire diamond delivery",
    meta: "Manual delivery",
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


/* =========================
   PRICE
========================= */

function priceLabel(service) {
  if (service.priceText) {
    return service.priceText;
  }

  if (service.price) {
    return "₹" + service.price.toLocaleString("en-IN");
  }

  return "Custom";
}


/* =========================
   CATEGORY NAVIGATION
========================= */

function renderNav() {
  const nav = document.getElementById("catNav");

  if (!nav) return;

  nav.innerHTML = categories
    .map(category => `
      <button
        class="cat-btn ${category.id === activeCat ? "active" : ""}"
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


/* =========================
   SERVICE CARDS
========================= */

function renderCards() {
  const grid = document.getElementById("serviceGrid");

  if (!grid) return;

  grid.innerHTML = services
    .map((service, index) => ({
      service,
      index
    }))
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

  const tgNote =
    document.getElementById("tgContact");

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


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const grid =
      document.getElementById("serviceGrid");

    if (!grid) {
      console.error(
        "serviceGrid not found"
      );
      return;
    }

    renderNav();
    renderCards();
  }
);


/* =========================
   CHECKOUT
========================= */

function isUnsubscribe(service) {
  return service &&
    service.cat === "unsubscribe";
}


function openCheckout(index) {
  selected = services[index];

  document.getElementById(
    "checkoutTitle"
  ).textContent = selected.name;

  document.getElementById(
    "checkoutPrice"
  ).textContent = priceLabel(selected);


  const idInput =
    document.getElementById("uid");

  const labelText =
    document.getElementById("uidLabelText");

  const playerField =
    document.getElementById("playerField");

  const playerInput =
    document.getElementById("player");

  const playerLabelText =
    document.getElementById(
      "playerLabelText"
    );

  const playerHelp =
    document.getElementById(
      "playerHelp"
    );


  /* Gmail service */

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
      playerField.style.display =
        "none";
    }

  } else {

    /* Normal services */

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
      playerField.style.display =
        "";
    }
  }


  if (playerInput) {
    playerInput.value = "";
  }


  /* Diamond delivery */

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

  }


  /* Play Store Redeem */

  else if (selected.cat === "redeem") {

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

  }


  /* Other services */

  else {

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


/* =========================
   PAYMENT
========================= */

function showPayment() {

  const value =
    document
      .getElementById("uid")
      .value
      .trim();


  /* Gmail validation */

  if (isUnsubscribe(selected)) {

    const gmailPattern =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    if (!value) {

      alert(
        "Gmail address enter karo."
      );

      return;
    }

    if (!gmailPattern.test(value)) {

      alert(
        "Sahi Gmail address enter karo (e.g. yourname@gmail.com)."
      );

      return;
    }

  }


  /* UID validation */

  else {

    if (!value) {

      alert(
        "Free Fire UID enter karo."
      );

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


/* =========================
   COPY UPI
========================= */

function copyUPI() {

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard.writeText(UPI)
      .then(() => {

        alert(
          "UPI ID copied: " + UPI
        );

      })
      .catch(() => {

        alert(
          "UPI ID: " + UPI
        );

      });

  } else {

    alert(
      "UPI ID: " + UPI
    );
  }
}


/* =========================
   SUBMIT ORDER TO SUPABASE
========================= */

async function submitOrder() {

  const utrInput =
    document.getElementById("utr");

  const uidInput =
    document.getElementById("uid");

  const playerInput =
    document.getElementById("player");

  const status =
    document.getElementById("status");


  const utr =
    utrInput.value.trim();

  const uid =
    uidInput.value.trim();

  const player =
    playerInput
      ? playerInput.value.trim()
      : "";


  if (!utr) {

    alert(
      "Payment ke baad UTR / Transaction ID enter karo."
    );

    return;
  }


  if (!selected) {

    alert(
      "Please select a service first."
    );

    return;
  }


  /*
    Disable button while submitting
    to prevent duplicate clicks.
  */

  const submitButton =
    document.querySelector(
      "#payment .full"
    );

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent =
      "Submitting...";
  }


  status.textContent =
    "Submitting your order...";


  /*
    Database fields:
    service_name
    category
    amount
    uid
    player_name
    contact
    utr
    status
  */

  let contact = null;
  let playerName = null;


  if (selected.cat === "diamonds") {

    contact = player || null;

  }

  else if (selected.cat === "redeem") {

    contact = player || null;

  }

  else {

    playerName = player || null;

  }


  const order = {

    service_name: selected.name,

    category: selected.cat,

    amount: selected.price,

    uid: uid || null,

    player_name: playerName,

    contact: contact,

    utr: utr,

    status: "pending"
  };


  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("orders")
      .insert([order])
      .select();


    if (error) {

      console.error(
        "Supabase order error:",
        error
      );

      status.textContent =
        "Order submit nahi hua. Please try again.";

      alert(
        "Order submit nahi hua. Supabase error check karo."
      );

      return;
    }


    console.log(
      "Order created:",
      data
    );


    status.textContent =
      "Order submitted successfully. Payment is pending verification.";


    alert(
      "Order submitted successfully!"
    );


    /*
      Clear UTR after successful order.
    */

    utrInput.value = "";


  } catch (error) {

    console.error(
      "Unexpected error:",
      error
    );

    status.textContent =
      "Something went wrong. Please try again.";

    alert(
      "Something went wrong. Please try again."
    );

  } finally {

    if (submitButton) {

      submitButton.disabled = false;

      submitButton.textContent =
        "Submit Payment Details";
    }
  }
}
