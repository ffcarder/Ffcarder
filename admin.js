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
   UPDATE STATUS
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
