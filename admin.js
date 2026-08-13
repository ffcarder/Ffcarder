const SUPABASE_URL =
  "https://wlldnjdgngnnwtdakkbg.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LRDs-toBVkcc0tfhts_stA_mirTYqPz";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


const loginPage =
  document.getElementById("loginPage");

const adminPage =
  document.getElementById("adminPage");

const loginForm =
  document.getElementById("loginForm");

const loginButton =
  document.getElementById("loginButton");

const loginError =
  document.getElementById("loginError");

const ordersBody =
  document.getElementById("ordersBody");

const ordersTable =
  document.getElementById("ordersTable");

const ordersLoading =
  document.getElementById("ordersLoading");

const ordersEmpty =
  document.getElementById("ordersEmpty");

const adminMessage =
  document.getElementById("adminMessage");


/* ==========================================
   LOGIN
   ========================================== */

loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    loginError.textContent = "";

    const email =
      document
        .getElementById("email")
        .value
        .trim();

    const password =
      document
        .getElementById("password")
        .value;

    if (!email || !password) {

      loginError.textContent =
        "Email aur password dono enter karo.";

      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {

      const {
        data,
        error
      } =
        await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

      if (error) {
        throw error;
      }

      if (!data || !data.session) {

        throw new Error(
          "Login session create nahi hui."
        );

      }

      await checkAdmin();

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      loginError.textContent =
        error.message ||
        "Login failed.";

    } finally {

      loginButton.disabled = false;
      loginButton.textContent = "Login";

    }

  }
);


/* ==========================================
   CHECK ADMIN
   ========================================== */

async function checkAdmin() {

  try {

    const {
      data: {
        user
      }
    } =
      await supabaseClient.auth.getUser();

    if (!user) {

      showLogin();

      return;
    }


    console.log(
      "LOGGED IN USER:",
      user.id
    );


    const {
      data,
      error
    } =
      await supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();


    if (error) {

      console.error(
        "ADMIN CHECK ERROR:",
        error
      );

      await supabaseClient.auth.signOut();

      showLogin();

      loginError.textContent =
        "Admin verification failed: " +
        (
          error.message ||
          "Unknown error"
        );

      return;
    }


    if (!data) {

      await supabaseClient.auth.signOut();

      showLogin();

      loginError.textContent =
        "Access denied. Ye account admin nahi hai.";

      return;
    }


    console.log(
      "ADMIN VERIFIED:",
      data
    );


    showAdmin();

    await loadOrders();

    await loadServices();

  } catch (error) {

    console.error(
      "CHECK ADMIN ERROR:",
      error
    );

    await supabaseClient.auth.signOut();

    showLogin();

    loginError.textContent =
      error.message ||
      "Admin verification failed.";

  }

}


/* ==========================================
   SHOW / HIDE
   ========================================== */

function showLogin() {

  loginPage.classList.remove(
    "hidden"
  );

  adminPage.classList.add(
    "hidden"
  );

}


function showAdmin() {

  loginPage.classList.add(
    "hidden"
  );

  adminPage.classList.remove(
    "hidden"
  );

}


/* ==========================================
   LOAD ORDERS
   ========================================== */

async function loadOrders() {

  ordersLoading.classList.remove(
    "hidden"
  );

  ordersEmpty.classList.add(
    "hidden"
  );

  ordersTable.classList.add(
    "hidden"
  );

  ordersBody.innerHTML = "";


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("orders")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      throw error;

    }


    const orders =
      Array.isArray(data)
        ? data
        : [];


    console.log(
      "ORDERS:",
      orders
    );


    updateStats(
      orders
    );


    if (
      orders.length === 0
    ) {

      ordersEmpty.classList.remove(
        "hidden"
      );

    } else {

      renderOrders(
        orders
      );

      ordersTable.classList.remove(
        "hidden"
      );

    }


    const lastUpdated =
      document.getElementById(
        "lastUpdated"
      );


    if (lastUpdated) {

      lastUpdated.textContent =
        "Updated " +
        new Date().toLocaleTimeString(
          "en-IN"
        );

    }


  } catch (error) {

    console.error(
      "LOAD ORDERS ERROR:",
      error
    );


    showMessage(
      "Orders load nahi hue: " +
      (
        error.message ||
        "Unknown error"
      )
    );


    ordersEmpty.classList.remove(
      "hidden"
    );


  } finally {

    ordersLoading.classList.add(
      "hidden"
    );

  }

}


/* ==========================================
   STATS
   ========================================== */

function updateStats(
  orders
) {

  const total =
    orders.length;


  const pending =
    orders.filter(
      order =>
        order.status === "pending"
    ).length;


  const completed =
    orders.filter(
      order =>
        order.status === "completed"
    ).length;


  const amount =
    orders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        Number(
          order.amount || 0
        ),
      0
    );


  document.getElementById(
    "totalOrders"
  ).textContent =
    total;


  document.getElementById(
    "pendingOrders"
  ).textContent =
    pending;


  document.getElementById(
    "completedOrders"
  ).textContent =
    completed;


  document.getElementById(
    "totalAmount"
  ).textContent =
    "₹" +
    amount.toLocaleString(
      "en-IN"
    );

}


/* ==========================================
   RENDER ORDERS
   ========================================== */

function renderOrders(
  orders
) {

  ordersBody.innerHTML = "";


  orders.forEach(
    order => {

      const tr =
        document.createElement(
          "tr"
        );


      /* ID */

      const id =
        document.createElement(
          "td"
        );

      id.textContent =
        order.id || "-";


      /* DATE */

      const date =
        document.createElement(
          "td"
        );

      date.textContent =
        formatDate(
          order.created_at
        );


      /* SERVICE */

      const service =
        document.createElement(
          "td"
        );

      service.textContent =
        order.service_name || "-";


      /* CATEGORY */

      const category =
        document.createElement(
          "td"
        );

      category.textContent =
        order.category || "-";


      /* AMOUNT */

      const amount =
        document.createElement(
          "td"
        );

      amount.textContent =
        "₹" +
        Number(
          order.amount || 0
        ).toLocaleString(
          "en-IN"
        );


      /* UID / GMAIL */

      const uid =
        document.createElement(
          "td"
        );

      uid.textContent =
        order.uid || "-";


      /* PLAYER / CONTACT */

      const player =
        document.createElement(
          "td"
        );

      player.textContent =
        order.player_name ||
        order.contact ||
        "-";


      /* UTR */

      const utr =
        document.createElement(
          "td"
        );

      utr.className =
        "utr";

      utr.textContent =
        order.utr || "-";


      /* STATUS */

      const statusCell =
        document.createElement(
          "td"
        );


      const select =
        document.createElement(
          "select"
        );

      select.className =
        "status-select";


      const statuses = [
        "pending",
        "verified",
        "completed",
        "rejected"
      ];


      statuses.forEach(
        status => {

          const option =
            document.createElement(
              "option"
            );

          option.value =
            status;

          option.textContent =
            status
              .charAt(0)
              .toUpperCase() +
            status.slice(1);


          if (
            order.status ===
            status
          ) {

            option.selected =
              true;

          }


          select.appendChild(
            option
          );

        }
      );


      select.dataset.oldValue =
        order.status ||
        "pending";


      select.addEventListener(
        "change",
        function () {

          updateOrderStatus(
            order.id,
            select.value,
            select
          );

        }
      );


      statusCell.appendChild(
        select
      );


      tr.appendChild(
        id
      );

      tr.appendChild(
        date
      );

      tr.appendChild(
        service
      );

      tr.appendChild(
        category
      );

      tr.appendChild(
        amount
      );

      tr.appendChild(
        uid
      );

      tr.appendChild(
        player
      );

      tr.appendChild(
        utr
      );

      tr.appendChild(
        statusCell
      );


      ordersBody.appendChild(
        tr
      );

    }
  );

}


/* ==========================================
   UPDATE ORDER STATUS
   ========================================== */

async function updateOrderStatus(
  orderId,
  newStatus,
  select
) {

  const oldValue =
    select.dataset.oldValue ||
    "pending";


  select.disabled = true;


  try {

    const {
      error
    } =
      await supabaseClient
        .from("orders")
        .update({
          status: newStatus
        })
        .eq(
          "id",
          orderId
        );


    if (error) {

      throw error;

    }


    select.dataset.oldValue =
      newStatus;


    showMessage(
      "Order status updated: " +
      newStatus
    );


    await loadOrders();


  } catch (error) {

    console.error(
      "STATUS UPDATE ERROR:",
      error
    );


    alert(
      "Status update nahi hua.\n\n" +
      (
        error.message ||
        "Unknown error"
      )
    );


    select.value =
      oldValue;


  } finally {

    select.disabled =
      false;

  }

}


/* ==========================================
   SERVICE STOCK MANAGEMENT
   ========================================== */

const serviceKeys = {

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

  "4,000 Diamonds":
    "diamonds_4000",

  "10,000 Diamonds":
    "diamonds_10000",

  "₹100 Play Store Redeem Code":
    "redeem_100",

  "₹500 Play Store Redeem Code":
    "redeem_500",

  "₹1,000 Play Store Redeem Code":
    "redeem_1000"

};


async function loadServices() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("services")
        .select(
          "id, service_key, name, in_stock"
        )
        .order(
          "id",
          {
            ascending: true
          }
        );


    if (error) {

      throw error;

    }


    console.log(
      "SERVICES:",
      data
    );


    renderStockManager(
      Array.isArray(data)
        ? data
        : []
    );


  } catch (error) {

    console.error(
      "LOAD SERVICES ERROR:",
      error
    );


    showMessage(
      "Services load nahi hui: " +
      (
        error.message ||
        "Unknown error"
      )
    );

  }

}


/* ==========================================
   CREATE STOCK MANAGER
   ========================================== */

function renderStockManager(
  services
) {

  let box =
    document.getElementById(
      "stockManager"
    );


  if (!box) {

    box =
      document.createElement(
        "section"
      );

    box.id =
      "stockManager";


    box.style.cssText = `
      margin-bottom:25px;
      background:#0b1017;
      border:1px solid #273140;
      border-radius:20px;
      overflow:hidden;
    `;


    const content =
      document.querySelector(
        ".content"
      );


    if (!content) {
      return;
    }


    const stats =
      document.querySelector(
        ".stats"
      );


    if (
      stats &&
      stats.nextSibling
    ) {

      content.insertBefore(
        box,
        stats.nextSibling
      );

    } else {

      content.prepend(
        box
      );

    }

  }


  box.innerHTML = `

    <div style="
      padding:18px 20px;
      border-bottom:1px solid #273140;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:15px;
      flex-wrap:wrap;
    ">

      <div>

        <h2 style="
          margin:0 0 5px;
          font-size:20px;
          color:#f5f7fb;
        ">
          Service Stock
        </h2>

        <p style="
          margin:0;
          color:#8f9bad;
          font-size:13px;
        ">
          Control which services customers can order.
        </p>

      </div>

      <div style="
        color:#8f9bad;
        font-size:13px;
      ">
        ${services.length} services
      </div>

    </div>


    <div
      id="stockList"
      style="
        display:grid;
        gap:1px;
        background:#202630;
      ">
    </div>

  `;


  const list =
    document.getElementById(
      "stockList"
    );


  services.forEach(
    service => {

      const row =
        document.createElement(
          "div"
        );


      row.style.cssText = `
        background:#0b1017;
        padding:15px 20px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:15px;
      `;


      const info =
        document.createElement(
          "div"
        );


      info.style.cssText = `
        min-width:0;
        flex:1;
      `;


      const name =
        document.createElement(
          "div"
        );


      name.textContent =
        service.name;


      name.style.cssText = `
        color:#f5f7fb;
        font-size:14px;
        font-weight:750;
        margin-bottom:5px;
      `;


      const key =
        document.createElement(
          "div"
        );


      key.textContent =
        service.service_key;


      key.style.cssText = `
        color:#687386;
        font-size:11px;
        font-family:monospace;
        word-break:break-all;
      `;


      info.appendChild(
        name
      );

      info.appendChild(
        key
      );


      const controls =
        document.createElement(
          "div"
        );


      controls.style.cssText = `
        display:flex;
        align-items:center;
        gap:10px;
        flex-shrink:0;
      `;


      const badge =
        document.createElement(
          "span"
        );


      updateStockBadge(
        badge,
        service.in_stock
      );


      const toggle =
        document.createElement(
          "button"
        );


      toggle.type =
        "button";


      toggle.textContent =
        service.in_stock
          ? "Out of Stock"
          : "Mark In Stock";


      toggle.style.cssText = `
        min-height:40px;
        padding:0 13px;
        border-radius:10px;
        border:1px solid #303b4c;
        background:#080c12;
        color:#f5f7fb;
        cursor:pointer;
        font-weight:750;
        font-size:13px;
      `;


      toggle.addEventListener(
        "click",
        function () {

          updateServiceStock(
            service.id,
            !service.in_stock,
            toggle,
            badge
          );

        }
      );


      controls.appendChild(
        badge
      );

      controls.appendChild(
        toggle
      );


      row.appendChild(
        info
      );

      row.appendChild(
        controls
      );


      list.appendChild(
        row
      );

    }
  );

}


/* ==========================================
   STOCK BADGE
   ========================================== */

function updateStockBadge(
  badge,
  inStock
) {

  badge.textContent =
    inStock
      ? "IN STOCK"
      : "OUT OF STOCK";


  badge.style.cssText =
    inStock
      ? `
        display:inline-flex;
        align-items:center;
        min-height:30px;
        padding:0 9px;
        border-radius:8px;
        background:#0b2115;
        border:1px solid #164b2b;
        color:#5ee28a;
        font-size:11px;
        font-weight:850;
        white-space:nowrap;
      `
      : `
        display:inline-flex;
        align-items:center;
        min-height:30px;
        padding:0 9px;
        border-radius:8px;
        background:#241014;
        border:1px solid #55202a;
        color:#ff7b88;
        font-size:11px;
        font-weight:850;
        white-space:nowrap;
      `;

}


/* ==========================================
   UPDATE SERVICE STOCK
   ========================================== */

async function updateServiceStock(
  serviceId,
  newStock,
  button,
  badge
) {

  button.disabled =
    true;


  const originalText =
    button.textContent;


  button.textContent =
    "Updating...";


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("services")
        .update({
          in_stock: newStock
        })
        .eq(
          "id",
          serviceId
        )
        .select(
          "id, service_key, name, in_stock"
        )
        .single();


    if (error) {

      throw error;

    }


    if (!data) {

      throw new Error(
        "Service update nahi hui."
      );

    }


    updateStockBadge(
      badge,
      data.in_stock
    );


    button.textContent =
      data.in_stock
        ? "Out of Stock"
        : "Mark In Stock";


    showMessage(
      data.name +
      " → " +
      (
        data.in_stock
          ? "In Stock"
          : "Out of Stock"
      )
    );


  } catch (error) {

    console.error(
      "STOCK UPDATE ERROR:",
      error
    );


    alert(
      "Stock update nahi hua.\n\n" +
      (
        error.message ||
        "Unknown error"
      )
    );


    button.textContent =
      originalText;

  } finally {

    button.disabled =
      false;

  }

}


/* ==========================================
   LOGOUT
   ========================================== */

document
  .getElementById(
    "logoutButton"
  )
  .addEventListener(
    "click",
    async function () {

      await supabaseClient.auth.signOut();

      showLogin();

      loginError.textContent = "";

    }
  );


/* ==========================================
   REFRESH
   ========================================== */

document
  .getElementById(
    "refreshButton"
  )
  .addEventListener(
    "click",
    async function () {

      await loadOrders();

      await loadServices();

    }
  );


/* ==========================================
   HELPERS
   ========================================== */

function formatDate(
  value
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return date.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


function showMessage(
  text
) {

  adminMessage.textContent =
    text;


  adminMessage.classList.remove(
    "hidden"
  );


  setTimeout(
    function () {

      adminMessage.classList.add(
        "hidden"
      );

    },
    3500
  );

}


/* ==========================================
   INITIAL SESSION CHECK
   ========================================== */

(async function init() {

  try {

    const {
      data: {
        session
      }
    } =
      await supabaseClient.auth.getSession();


    if (session) {

      await checkAdmin();

    } else {

      showLogin();

    }


  } catch (error) {

    console.error(
      "INIT ERROR:",
      error
    );


    showLogin();

    loginError.textContent =
      "Load failed: " +
      (
        error.message ||
        "Unknown error"
      );

  }

})();
