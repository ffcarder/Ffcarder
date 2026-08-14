const SUPABASE_URL =
  "https://wlldnjdgngnnwtdakkbg.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LRDs-toBVkcc0tfhts_stA_mirTYqPz";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

const UPI = "ffcarderupta@fam";


/* ==========================================
   CATEGORIES
   ========================================== */

const categories = [
  {
    id: "unsubscribe",
    name: "Unsubscribe"
  },
  {
    id: "craftland",
    name: "Craftland Bots"
  },
  {
    id: "guild",
    name: "Guild Glory"
  },
  {
    id: "redeem",
    name: "Play Store Redeem Code"
  }
];


/* ==========================================
   SERVICES
   ========================================== */

const services = [

  /* =========================
     UNSUBSCRIBE
     ========================= */

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


  /* =========================
     CRAFTLAND
     ========================= */

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


  /* =========================
     GUILD
     ========================= */

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


  /* =========================
     REDEEM
     ========================= */

  {
    cat: "redeem",
    name: "₹400 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 300
  },

  {
    cat: "redeem",
    name: "₹700 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 500
  },

  {
    cat: "redeem",
    name: "₹1,200 Play Store Redeem Code",
    desc: "Google Play gift code",
    meta: "Digital delivery",
    price: 1000
  }

];


let selected = null;

let activeCat =
  categories[0].id;


/* ==========================================
   SERVICE STOCK KEY MAP
   ========================================== */

function getServiceKey(service) {

  const keyMap = {

    "Single Unsubscribe":
      "single_unsubscribe",

    "Double Unsubscribe":
      "double_unsubscribe",

    "Craftland Followers":
      "craftland_followers",

    "Craftland Followers (Fast Plan)":
      "craftland_followers_fast",

    "Craftland Map Likes":
      "craftland_map_likes",

    "Craftland Map Stars":
      "craftland_map_stars",

    "Craftland Level Up":
      "craftland_level_up",

    "Guild Level 7":
      "guild_level_7",

    "Guild Region Top 15":
      "guild_region_top_15",

    "₹400 Play Store Redeem Code":
      "redeem_400",

    "₹700 Play Store Redeem Code":
      "redeem_700",

    "₹1,200 Play Store Redeem Code":
      "redeem_1200"

  };


  return keyMap[service.name] || null;

}


/* ==========================================
   LOAD SERVICE STOCK
   ========================================== */

async function getStockMap() {

  const {
    data,
    error
  } =
    await supabaseClient
      .from("service_stock")
      .select(
        "service_key,is_in_stock"
      );


  if (error) {

    console.error(
      "STOCK LOAD ERROR:",
      error
    );

    throw error;

  }


  const stockMap = {};


  (data || []).forEach(
    row => {

      stockMap[
        String(
          row.service_key
        ).trim()
      ] =
        row.is_in_stock === true;

    }
  );


  console.log(
    "SERVICE STOCK MAP:",
    stockMap
  );


  return stockMap;

}


/* ==========================================
   PRICE
   ========================================== */

function priceLabel(service) {

  if (service.priceText) {

    return service.priceText;

  }


  if (
    service.price !== undefined &&
    service.price !== null
  ) {

    return (
      "₹" +
      Number(
        service.price
      ).toLocaleString(
        "en-IN"
      )
    );

  }


  return "Custom";

}


/* ==========================================
   CATEGORY NAVIGATION
   ========================================== */

function renderNav() {

  const nav =
    document.getElementById(
      "catNav"
    );


  if (!nav) return;


  nav.innerHTML =
    categories
      .map(
        category => `

          <button
            class="cat-btn ${
              category.id === activeCat
                ? "active"
                : ""
            }"
            data-cat="${category.id}"
            onclick="selectCategory('${category.id}')"
          >

            ${escapeHTML(
              category.name
            )}

          </button>

        `
      )
      .join("");

}


function selectCategory(id) {

  activeCat = id;

  renderNav();

  renderCards();

}


/* ==========================================
   SERVICE CARDS
   ========================================== */

async function renderCards() {

  const grid =
    document.getElementById(
      "serviceGrid"
    );


  if (!grid) return;


  grid.innerHTML = `

    <div style="
      padding:30px;
      text-align:center;
      color:#8f9bad;
      font-size:15px;
    ">

      Loading services...

    </div>

  `;


  try {

    const stockMap =
      await getStockMap();


    const filteredServices =
      services
        .map(
          (
            service,
            index
          ) => ({
            service,
            index
          })
        )
        .filter(
          ({
            service
          }) =>
            service.cat ===
            activeCat
        );


    grid.innerHTML =
      filteredServices
        .map(
          ({
            service,
            index
          }) => {

            const serviceKey =
              getServiceKey(
                service
              );


            let inStock = true;


            if (
              serviceKey &&
              Object.prototype.hasOwnProperty.call(
                stockMap,
                serviceKey
              )
            ) {

              inStock =
                stockMap[
                  serviceKey
                ];

            }


            console.log(
              "STOCK CHECK:",
              service.name,
              serviceKey,
              inStock
            );


            /* =========================
               OUT OF STOCK
               ========================= */

            if (!inStock) {

              return `

                <article
                  class="card"
                  style="
                    opacity:0.78;
                    position:relative;
                  "
                >

                  <h3>

                    ${escapeHTML(
                      service.name
                    )}

                  </h3>


                  <p>

                    ${escapeHTML(
                      service.desc
                    )}

                  </p>


                  ${
                    service.meta
                      ? `

                        <p class="meta">

                          ${escapeHTML(
                            service.meta
                          )}

                        </p>

                      `
                      : ""
                  }


                  <div class="row">

                    <span class="price">

                      ${priceLabel(
                        service
                      )}

                    </span>


                    <button
                      class="smallbtn"
                      type="button"
                      disabled
                      style="
                        cursor:not-allowed;
                        opacity:1;
                        color:#ff7b88;
                        background:#241014;
                        border:1px solid #55202a;
                        font-weight:800;
                      "
                    >

                      OUT OF STOCK

                    </button>

                  </div>

                </article>

              `;

            }


            /* =========================
               IN STOCK
               ========================= */

            return `

              <article
                class="card"
              >

                <h3>

                  ${escapeHTML(
                    service.name
                  )}

                </h3>


                <p>

                  ${escapeHTML(
                    service.desc
                  )}

                </p>


                ${
                  service.meta
                    ? `

                      <p class="meta">

                        ${escapeHTML(
                          service.meta
                        )}

                      </p>

                    `
                    : ""
                }


                <div class="row">

                  <span class="price">

                    ${priceLabel(
                      service
                    )}

                  </span>


                  <button
                    class="smallbtn"
                    type="button"
                    onclick="openCheckout(${index})"
                  >

                    Buy now

                  </button>

                </div>

              </article>

            `;

          }
        )
        .join("");


    const tgNote =
      document.getElementById(
        "tgContact"
      );


    if (tgNote) {

      tgNote.innerHTML = "";

    }


  }

  catch (error) {

    console.error(
      "SERVICE STOCK ERROR:",
      error
    );


    grid.innerHTML = `

      <div style="
        padding:20px;
        color:#ff7b88;
        background:#241014;
        border:1px solid #55202a;
        border-radius:14px;
      ">

        Services load nahi ho paayi.

        <br><br>

        ${escapeHTML(
          error.message ||
          "Unknown error"
        )}

      </div>

    `;

  }

}


/* ==========================================
   PAGE LOAD
   ========================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const grid =
      document.getElementById(
        "serviceGrid"
      );


    if (!grid) {

      console.error(
        "serviceGrid not found"
      );

      return;

    }


    renderNav();

    renderCards();

    createTrackOrderUI();

  }
);


/* ==========================================
   SERVICE HELPERS
   ========================================== */

function isUnsubscribe(
  service
) {

  return (
    service &&
    service.cat ===
      "unsubscribe"
  );

}


/* ==========================================
   CHECKOUT
   ========================================== */

function openCheckout(index) {

  selected =
    services[index];


  const checkoutTitle =
    document.getElementById(
      "checkoutTitle"
    );


  const checkoutPrice =
    document.getElementById(
      "checkoutPrice"
    );


  if (checkoutTitle) {

    checkoutTitle.textContent =
      selected.name;

  }


  if (checkoutPrice) {

    checkoutPrice.textContent =
      priceLabel(
        selected
      );

  }


  const idInput =
    document.getElementById(
      "uid"
    );


  const labelText =
    document.getElementById(
      "uidLabelText"
    );


  const playerField =
    document.getElementById(
      "playerField"
    );


  const playerInput =
    document.getElementById(
      "player"
    );


  const playerLabelText =
    document.getElementById(
      "playerLabelText"
    );


  const playerHelp =
    document.getElementById(
      "playerHelp"
    );


  if (
    isUnsubscribe(
      selected
    )
  ) {

    if (labelText) {

      labelText.textContent =
        "Gmail address";

    }


    if (idInput) {

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

    }


    if (playerField) {

      playerField.style.display =
        "none";

    }

  }

  else {

    if (labelText) {

      labelText.textContent =
        "Free Fire UID";

    }


    if (idInput) {

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

    }


    if (playerField) {

      playerField.style.display =
        "";

    }

  }


  if (playerInput) {

    playerInput.value = "";

  }


  /* =========================
     REDEEM CODE
     ========================= */

  if (
    selected.cat ===
    "redeem"
  ) {

    if (playerLabelText) {

      playerLabelText.textContent =
        "Email / Contact Number";

    }


    if (playerInput) {

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

    }


    if (playerHelp) {

      playerHelp.textContent =
        "Add your contact details for code delivery.";

    }

  }

  else {

    if (playerLabelText) {

      playerLabelText.textContent =
        "Player name (optional)";

    }


    if (playerInput) {

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

    }


    if (playerHelp) {

      playerHelp.textContent =
        "";

    }

  }


  const checkout =
    document.getElementById(
      "checkout"
    );


  if (checkout) {

    checkout.classList.remove(
      "hidden"
    );

  }

}


function closeCheckout() {

  const checkout =
    document.getElementById(
      "checkout"
    );


  if (checkout) {

    checkout.classList.add(
      "hidden"
    );

  }

}


/* ==========================================
   PAYMENT
   ========================================== */

function showPayment() {

  if (!selected) {

    alert(
      "Please select a service first."
    );

    return;

  }


  const uidElement =
    document.getElementById(
      "uid"
    );


  const value =
    uidElement
      ? uidElement.value.trim()
      : "";


  if (
    isUnsubscribe(
      selected
    )
  ) {

    const gmailPattern =
      /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;


    if (!value) {

      alert(
        "Gmail address enter karo."
      );

      return;

    }


    if (
      !gmailPattern.test(
        value
      )
    ) {

      alert(
        "Sahi Gmail address enter karo."
      );

      return;

    }

  }

  else {

    if (!value) {

      alert(
        "Free Fire UID enter karo."
      );

      return;

    }

  }


  closeCheckout();


  const payment =
    document.getElementById(
      "payment"
    );


  if (payment) {

    payment.classList.remove(
      "hidden"
    );

  }

}


function closePayment() {

  const payment =
    document.getElementById(
      "payment"
    );


  if (payment) {

    payment.classList.add(
      "hidden"
    );

  }

}


/* ==========================================
   COPY UPI
   ========================================== */

function copyUPI() {

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(
        UPI
      )
      .then(
        () => {

          alert(
            "UPI ID copied: " +
            UPI
          );

        }
      )
      .catch(
        () => {

          alert(
            "UPI ID: " +
            UPI
          );

        }
      );

  }

  else {

    alert(
      "UPI ID: " +
      UPI
    );

  }

}


/* ==========================================
   SUBMIT ORDER
   ========================================== */

async function submitOrder() {

  const utrInput =
    document.getElementById(
      "utr"
    );


  const uidInput =
    document.getElementById(
      "uid"
    );


  const playerInput =
    document.getElementById(
      "player"
    );


  const status =
    document.getElementById(
      "status"
    );


  const utr =
    utrInput
      ? utrInput.value.trim()
      : "";


  const uid =
    uidInput
      ? uidInput.value.trim()
      : "";


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


  /* FINAL STOCK CHECK */

  try {

    const stockMap =
      await getStockMap();


    const serviceKey =
      getServiceKey(
        selected
      );


    if (
      serviceKey &&
      stockMap[serviceKey] === false
    ) {

      alert(
        "Ye service abhi Out of Stock hai."
      );


      closePayment();


      await renderCards();


      return;

    }

  }

  catch (error) {

    console.error(
      "STOCK CHECK ERROR:",
      error
    );

  }


  const submitButton =
    document.querySelector(
      "#payment .full"
    );


  if (submitButton) {

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";

  }


  if (status) {

    status.textContent =
      "Submitting your order...";

  }


  let contact = null;

  let playerName = null;


  if (
    selected.cat ===
    "redeem"
  ) {

    contact =
      player || null;

  }

  else {

    playerName =
      player || null;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "create_order",
        {

          p_service_name:
            selected.name,

          p_category:
            selected.cat,

          p_amount:
            selected.price,

          p_uid:
            uid || null,

          p_player_name:
            playerName,

          p_contact:
            contact,

          p_utr:
            utr

        }
      );


    if (error) {

      console.error(
        "CREATE ORDER RPC ERROR:",
        error
      );


      if (status) {

        status.textContent =
          "Order submit nahi hua.";

      }


      alert(
        "SUPABASE ERROR\n\n" +
        "Message: " +
        (
          error.message ||
          "Unknown"
        ) +
        "\n\nCode: " +
        (
          error.code ||
          "Unknown"
        )
      );


      return;

    }


    if (
      data === null ||
      data === undefined
    ) {

      throw new Error(
        "Order ID nahi mila."
      );

    }


    const orderId =
      Number(
        data
      );


    if (
      !Number.isFinite(
        orderId
      )
    ) {

      throw new Error(
        "Invalid Order ID returned by server."
      );

    }


    console.log(
      "ORDER CREATED:",
      orderId
    );


    localStorage.setItem(
      "ffm_last_order",
      JSON.stringify({
        id:
          orderId
      })
    );


    if (status) {

      status.textContent =
        "Order submitted successfully. Payment is pending verification.";

    }


    alert(
      "Order submitted successfully!\n\n" +
      "Order ID: #" +
      orderId +
      "\n\n" +
      "Save this Order ID to track your order."
    );


    if (utrInput) {

      utrInput.value = "";

    }


    closePayment();


    const trackInput =
      document.getElementById(
        "trackOrderId"
      );


    if (trackInput) {

      trackInput.value =
        orderId;

    }


    const tracker =
      document.getElementById(
        "orderTracker"
      );


    if (tracker) {

      tracker.scrollIntoView({
        behavior:
          "smooth",
        block:
          "center"
      });

    }


    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          300
        )
    );


    await trackOrder();

  }

  catch (error) {

    console.error(
      "ORDER ERROR:",
      error
    );


    if (status) {

      status.textContent =
        "Order submit nahi hua.";

    }


    alert(
      "ORDER ERROR\n\n" +
      (
        error &&
        error.message
          ? error.message
          : "Load failed"
      )
    );

  }

  finally {

    if (submitButton) {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Payment Details";

    }

  }

}


/* ==========================================
   ORDER TRACKING UI
   ========================================== */

function createTrackOrderUI() {

  if (
    document.getElementById(
      "orderTracker"
    )
  ) {

    return;

  }


  const servicesSection =
    document.getElementById(
      "services"
    );


  if (!servicesSection) {

    return;

  }


  const tracker =
    document.createElement(
      "section"
    );


  tracker.id =
    "orderTracker";


  tracker.style.cssText = `
    max-width:760px;
    margin:40px auto 0;
    padding:22px;
    background:#0b1017;
    border:1px solid #273140;
    border-radius:20px;
  `;


  tracker.innerHTML = `

    <div style="
      color:#ffb800;
      font-size:12px;
      font-weight:800;
      letter-spacing:3px;
      margin-bottom:8px;
    ">

      ORDER TRACKING

    </div>


    <h2 style="
      margin:0 0 8px;
      color:#f5f7fb;
      font-size:24px;
    ">

      Track your order

    </h2>


    <p style="
      margin:0 0 18px;
      color:#8f9bad;
      font-size:14px;
      line-height:1.5;
    ">

      Enter your Order ID to check
      the latest order status.

    </p>


    <div style="
      display:grid;
      gap:10px;
    ">

      <input
        id="trackOrderId"
        type="text"
        inputmode="numeric"
        placeholder="Enter Order ID"
        style="
          width:100%;
          min-height:48px;
          padding:0 14px;
          background:#080c12;
          color:#f5f7fb;
          border:1px solid #303b4c;
          border-radius:12px;
          outline:none;
          box-sizing:border-box;
        "
      >


      <button
        id="trackButton"
        type="button"
        style="
          width:100%;
          min-height:48px;
          background:#ffb800;
          color:#05070b;
          border:0;
          border-radius:12px;
          font-weight:800;
          cursor:pointer;
        "
      >

        Check Order Status

      </button>

    </div>


    <div
      id="orderResult"
      style="
        margin-top:18px;
      "
    >

    </div>

  `;


  servicesSection.appendChild(
    tracker
  );


  const trackButton =
    document.getElementById(
      "trackButton"
    );


  if (trackButton) {

    trackButton.addEventListener(
      "click",
      trackOrder
    );

  }


  /* RESTORE LAST ORDER */

  try {

    const saved =
      localStorage.getItem(
        "ffm_last_order"
      );


    if (saved) {

      const parsed =
        JSON.parse(
          saved
        );


      if (
        parsed &&
        parsed.id
      ) {

        const input =
          document.getElementById(
            "trackOrderId"
          );


        if (input) {

          input.value =
            parsed.id;

        }

      }

    }

  }

  catch (error) {

    console.error(
      "LOCAL STORAGE ERROR:",
      error
    );

  }

}


/* ==========================================
   TRACK ORDER
   ========================================== */

async function trackOrder() {

  const idInput =
    document.getElementById(
      "trackOrderId"
    );


  const result =
    document.getElementById(
      "orderResult"
    );


  const button =
    document.getElementById(
      "trackButton"
    );


  if (!result) {

    return;

  }


  const orderId =
    idInput
      ? idInput.value.trim()
      : "";


  if (!orderId) {

    result.innerHTML = `

      <div style="
        padding:14px;
        border-radius:12px;
        background:#241b08;
        border:1px solid #5b4610;
        color:#ffcc4d;
        font-size:14px;
      ">

        Order ID enter karo.

      </div>

    `;

    return;

  }


  if (
    !/^[0-9]+$/.test(
      orderId
    )
  ) {

    result.innerHTML = `

      <div style="
        padding:14px;
        border-radius:12px;
        background:#241014;
        border:1px solid #55202a;
        color:#ff7b88;
        font-size:14px;
      ">

        Valid Order ID enter karo.

      </div>

    `;

    return;

  }


  if (button) {

    button.disabled =
      true;

    button.textContent =
      "Checking...";

  }


  result.innerHTML = `

    <div style="
      padding:14px;
      color:#8f9bad;
      font-size:14px;
    ">

      Checking order...

    </div>

  `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "get_order_status",
        {
          p_order_id:
            Number(
              orderId
            )
        }
      );


    if (error) {

      console.error(
        "TRACK ERROR:",
        error
      );

      throw error;

    }


    if (
      !data ||
      data.length === 0
    ) {

      result.innerHTML = `

        <div style="
          padding:15px;
          border-radius:12px;
          background:#241014;
          border:1px solid #55202a;
          color:#ff7b88;
          font-size:14px;
          line-height:1.5;
        ">

          Order not found.<br>
          Please check your Order ID.

        </div>

      `;

      return;

    }


    const order =
      data[0];


    renderOrderStatus(
      order
    );

  }

  catch (error) {

    console.error(
      "ORDER TRACKING ERROR:",
      error
    );


    result.innerHTML = `

      <div style="
        padding:15px;
        border-radius:12px;
        background:#241014;
        border:1px solid #55202a;
        color:#ff7b88;
        font-size:14px;
        line-height:1.5;
      ">

        Status check nahi ho saka.

        <br><br>

        ${escapeHTML(
          error &&
          error.message
            ? error.message
            : "Please try again."
        )}

      </div>

    `;

  }

  finally {

    if (button) {

      button.disabled =
        false;

      button.textContent =
        "Check Order Status";

    }

  }

}


/* ==========================================
   RENDER ORDER STATUS
   ========================================== */

function renderOrderStatus(
  order
) {

  const result =
    document.getElementById(
      "orderResult"
    );


  if (!result) {

    return;

  }


  const status =
    String(
      order.status ||
      "pending"
    ).toLowerCase();


  let title =
    "Payment Verification Pending";


  let message =
    "Your payment is waiting for manual verification.";


  let icon =
    "🟡";


  let border =
    "#5b4610";


  let background =
    "#241b08";


  let color =
    "#ffcc4d";


  /* VERIFIED */

  if (
    status ===
    "verified"
  ) {

    title =
      "Payment Verified";


    message =
      "Your payment has been verified. Your order is being processed.";


    icon =
      "🔵";


    border =
      "#173c5c";


    background =
      "#0c1c2a";


    color =
      "#66bfff";

  }


  /* COMPLETED */

  if (
    status ===
    "completed"
  ) {

    title =
      "Order Successful";


    message =
      "Your order has been completed successfully.";


    icon =
      "🟢";


    border =
      "#164b2b";


    background =
      "#0b2115";


    color =
      "#5ee28a";

  }


  /* REJECTED */

  if (
    status ===
    "rejected"
  ) {

    title =
      "Order Failed";


    message =
      "Your order/payment was rejected. Please contact the admin if you think this is a mistake.";


    icon =
      "🔴";


    border =
      "#55202a";


    background =
      "#241014";


    color =
      "#ff7b88";

  }


  result.innerHTML = `

    <div style="
      padding:18px;
      border-radius:15px;
      background:${background};
      border:1px solid ${border};
    ">


      <div style="
        color:${color};
        font-size:17px;
        font-weight:850;
        margin-bottom:7px;
      ">

        ${icon}
        ${title}

      </div>


      <div style="
        color:#aeb8c9;
        font-size:14px;
        line-height:1.5;
        margin-bottom:12px;
      ">

        ${message}

      </div>


      <div style="
        color:#7f899a;
        font-size:13px;
        line-height:1.7;
      ">

        Order:

        <strong style="
          color:#dce2ec;
        ">

          #${escapeHTML(
            order.id
          )}

        </strong>


        <br>


        Service:

        <strong style="
          color:#dce2ec;
        ">

          ${escapeHTML(
            order.service_name ||
            "-"
          )}

        </strong>


        <br>


        Amount:

        <strong style="
          color:#dce2ec;
        ">

          ₹${Number(
            order.amount ||
            0
          ).toLocaleString(
            "en-IN"
          )}

        </strong>

      </div>

    </div>

  `;

}


/* ==========================================
   HTML ESCAPE
   ========================================== */

function escapeHTML(
  value
) {

  return String(
    value
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}
