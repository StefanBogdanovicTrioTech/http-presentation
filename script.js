
"use strict";

/* ==========================================
   HTTP PROTOKOL — INTERAKTIVNA PREZENTACIJA
   GLAVNI JAVASCRIPT FAJL
   ========================================== */

/* 01 — STRANICE I NAVIGACIJA */

const PAGES = [
  { file: "uvod.html", title: "Uvod" },
  { file: "sta_je_http.html", title: "Šta je HTTP?" },
  { file: "kako_funkcionise.html", title: "Kako funkcioniše?" },
  { file: "http_poruka.html", title: "HTTP poruka" },
  { file: "http_metode.html", title: "HTTP metode" },
  { file: "statusni_kodovi.html", title: "Statusni kodovi" },
  { file: "http_https.html", title: "HTTP i HTTPS" },
  { file: "evolucija.html", title: "Evolucija HTTP-a" },
  { file: "http_u_praksi.html", title: "HTTP u praksi" },
  { file: "kviz.html", title: "Kviz i zaključak" }
];



function getCurrentPage() {
  return decodeURIComponent(
    window.location.pathname.split("/").pop() || "index.html"
  );
}

function getPageIndex() {
  return PAGES.findIndex(page => page.file === getCurrentPage());
}

function navigateTo(file) {
  window.location.href = file;
}

/* 02 — POMOĆNE FUNKCIJE */

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}

function setActiveButton(container, attribute, value) {
  if (!container) return;

  container.querySelectorAll(`[${attribute}]`).forEach(button => {
    const active = button.getAttribute(attribute) === value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function formatJSON(value) {
  return JSON.stringify(value, null, 2);
}

/* 03 — ZAJEDNIČKA POZADINA */

function renderBackground() {
  const container = byId("site-background");
  if (!container) return;

  container.className = "site-background";

  container.innerHTML = `
    <div class="ambient-glow left"></div>
    <div class="ambient-glow right"></div>
    <div class="parametric-ribbon left"></div>
    <div class="parametric-ribbon right"></div>
  `;
}

/* 04 — ZAJEDNIČKI HEADER */

function renderHeader() {
  const container = byId("site-header");
  if (!container) return;

  const isHome = getPageIndex() === -1;

  container.innerHTML = `
    <header class="site-header">
      <nav class="nav-shell" aria-label="Glavna navigacija">

        <a class="brand" href="index.html">
          <span class="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32"
                 fill="none" stroke="currentColor"
                 stroke-width="1.7" stroke-linecap="round">
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18"></path>
              <path d="M12 3c-5 5-5 13 0 18"></path>
              <path d="M12 3c5 5 5 13 0 18"></path>
            </svg>
          </span>
          <span><strong>HTTP</strong> PROTOKOL</span>
        </a>

        <div class="nav-links">

          <a class="nav-link ${isHome ? "active" : ""}"
             href="index.html">
            Početna
          </a>

          <a class="nav-link ${!isHome ? "active" : ""}"
             href="index.html#teme">
            Teme
          </a>

          <a class="nav-link"
             href="index.html#o-projektu">
            O projektu
          </a>

        </div>

      </nav>
    </header>
  `;
}

/* 05 — FOOTER */

function renderFooter() {
  const container = byId("site-footer");
  if (!container) return;

  container.innerHTML = `
    <footer class="site-footer">
      <p>
        <strong>HTTP PROTOKOL</strong>
        · Interaktivna prezentacija iz web programiranja
      </p>
      <p>
        Napravljeno pomoću HTML-a, CSS-a i JavaScripta.
      </p>
    </footer>
  `;
}

/* 06 — NAVIGACIJA IZMEĐU LEKCIJA */

function renderLessonNavigation() {
  const container = byId("lesson-navigation");
  const index = getPageIndex();

  if (!container || index < 0) return;

  const previous = index === 0
    ? { file: "index.html", title: "Početna" }
    : PAGES[index - 1];

  const next = index === PAGES.length - 1
    ? { file: "index.html", title: "Početna" }
    : PAGES[index + 1];

  container.className = "lesson-navigation";

  container.innerHTML = `
    <a class="btn btn-secondary" href="${previous.file}">
      ← ${previous.title}
    </a>

    <span class="lesson-counter">
      <strong>${String(index + 1).padStart(2, "0")}</strong>
      / ${PAGES.length}
    </span>

    <a class="btn btn-primary" href="${next.file}">
      ${next.title} →
    </a>
  `;
}

/* 07 — NAVIGACIJA TASTATUROM */

function initKeyboardNavigation() {
  document.addEventListener("keydown", event => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) return;

    const target = event.target;

    if (
      target.closest(
        "input, textarea, select, button, " +
        "[contenteditable='true'], [role='slider']"
      )
    ) return;

    const index = getPageIndex();

    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (index === -1) {
        navigateTo(PAGES[0].file);
      } else if (index < PAGES.length - 1) {
        navigateTo(PAGES[index + 1].file);
      }
    }

    if (event.key === "ArrowLeft" && index >= 0) {
      event.preventDefault();

      navigateTo(
        index === 0 ? "index.html" : PAGES[index - 1].file
      );
    }

    if (event.key.toLowerCase() === "h" &&
        event.key.length === 1) {
      navigateTo("index.html");
    }
  });
}

/* 08 — HOMEPAGE: INTERAKTIVNE TEME */

function initOrbitNavigation() {
  const caption = byId("orbit-caption");

  document.querySelectorAll(".orbit-node").forEach(node => {
    const name = node.dataset.title ||
      node.querySelector(".node-label")?.textContent ||
      "HTTP protokol";

    node.addEventListener("mouseenter", () => {
      if (caption) caption.textContent = name;
    });

    node.addEventListener("focus", () => {
      if (caption) caption.textContent = name;
    });

    node.addEventListener("mouseleave", () => {
      if (caption) {
        caption.textContent = "Izaberi temu za istraživanje";
      }
    });

    node.addEventListener("blur", () => {
      if (caption) {
        caption.textContent = "Izaberi temu za istraživanje";
      }
    });
  });
}

/* 09 — ANIMIRANO OBJAŠNJENJE HTTP TOKA */

const HTTP_FLOW = [
  {
    title: "1. Korisnik otvara web adresu",
    description:
      "Korisnik u browser unosi adresu sajta. Browser " +
      "priprema zahtev za odgovarajući server.",
    request: "Browser priprema HTTP zahtev...",
    response: "Odgovor još nije stigao."
  },
  {
    title: "2. Browser šalje HTTP zahtev",
    description:
      "Nakon uspostavljanja potrebne veze, browser " +
      "šalje zahtev u kom navodi željeni resurs.",
    request:
      "GET /index.html HTTP/1.1\n" +
      "Host: example.com\n" +
      "Accept: text/html",
    response: "Server prima zahtev..."
  },
  {
    title: "3. Server obrađuje zahtev",
    description:
      "Server proverava zahtev, pronalazi resurs " +
      "i priprema odgovarajući odgovor.",
    request: "GET /index.html",
    response: "Obrada zahteva u toku..."
  },
  {
    title: "4. Server vraća HTTP odgovor",
    description:
      "Server vraća statusni kod, zaglavlja " +
      "i, kada je potrebno, telo odgovora.",
    request: "GET /index.html",
    response:
      "HTTP/1.1 200 OK\n" +
      "Content-Type: text/html\n\n" +
      "<html>...</html>"
  },
  {
    title: "5. Browser prikazuje stranicu",
    description:
      "Browser obrađuje primljeni HTML, učitava " +
      "dodatne resurse i prikazuje stranicu korisniku.",
    request: "Zahtev je završen.",
    response: "Web stranica je prikazana."
  }
];

function initHTTPFlow() {
  const container = byId("flow-demo");
  if (!container) return;

  const previous = byId("flow-prev");
  const next = byId("flow-next");
  const reset = byId("flow-reset");

  let stepIndex = 0;

  function render() {
    const step = HTTP_FLOW[stepIndex];

    setText(
      "flow-step-number",
      `${stepIndex + 1} / ${HTTP_FLOW.length}`
    );

    setText("flow-step-title", step.title);
    setText("flow-step-description", step.description);
    setText("flow-request", step.request);
    setText("flow-response", step.response);

    container.dataset.step = String(stepIndex);

    if (previous) previous.disabled = stepIndex === 0;

    if (next) {
      next.disabled = stepIndex === HTTP_FLOW.length - 1;
    }
  }

  previous?.addEventListener("click", () => {
    stepIndex = Math.max(0, stepIndex - 1);
    render();
  });

  next?.addEventListener("click", () => {
    stepIndex = Math.min(HTTP_FLOW.length - 1, stepIndex + 1);
    render();
  });

  reset?.addEventListener("click", () => {
    stepIndex = 0;
    render();
  });

  render();
}

/* 10 — STRUKTURA HTTP PORUKE */

const HTTP_PARTS = {
  "request-line": {
    title: "Početna linija zahteva",
    description:
      "Sadrži HTTP metodu, putanju do resursa " +
      "i verziju protokola u HTTP/1.1.",
    example: "GET /users/1 HTTP/1.1"
  },

  "headers": {
    title: "HTTP zaglavlja (Headers)",
    description:
      "Prenose dodatne informacije, kao što su " +
      "tip sadržaja, prihvaćeni formati i host.",
    example:
      "Host: example.com\n" +
      "Accept: application/json\n" +
      "Content-Type: application/json"
  },

  "body": {
    title: "Telo poruke (Body)",
    description:
      "Sadrži podatke koje šaljemo ili primamo. " +
      "Neke HTTP poruke nemaju telo.",
    example:
      '{\n  "name": "Ana",\n  "age": 20\n}'
  },

  "status-line": {
    title: "Početna linija odgovora",
    description:
      "U HTTP/1.1 odgovoru sadrži verziju " +
      "protokola, statusni kod i opis statusa.",
    example: "HTTP/1.1 200 OK"
  }
};

function initHTTPParts() {
  const container = byId("part-tabs");
  if (!container) return;

  const buttons = container.querySelectorAll("[data-part]");

  function selectPart(part) {
    const data = HTTP_PARTS[part];
    if (!data) return;

    setActiveButton(container, "data-part", part);

    setText("part-title", data.title);
    setText("part-description", data.description);
    setText("part-example", data.example);
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      selectPart(button.dataset.part);
    });
  });

  selectPart("request-line");
}

/* 11 — HTTP METODE: SIMULATOR */

const HTTP_METHODS = {
  GET: {
    description:
      "GET služi za preuzimanje podataka sa servera.",
    request:
      "GET /api/users/1 HTTP/1.1\n" +
      "Host: example.com",
    status: "200 OK",
    response: {
      id: 1,
      name: "Ana",
      role: "student"
    }
  },

  POST: {
    description:
      "POST šalje podatke serveru, često radi " +
      "kreiranja novog resursa.",
    request:
      "POST /api/users HTTP/1.1\n" +
      "Content-Type: application/json\n\n" +
      '{ "name": "Marko" }',
    status: "201 Created",
    response: {
      id: 3,
      name: "Marko",
      created: true
    }
  },

  PUT: {
    description:
      "PUT kreira ili zamenjuje stanje resursa " +
      "na zadatoj adresi.",
    request:
      "PUT /api/users/1 HTTP/1.1\n" +
      "Content-Type: application/json\n\n" +
      '{ "name": "Nikola", "role": "student" }',
    status: "200 OK",
    response: {
      id: 1,
      name: "Nikola",
      role: "student"
    }
  },

  PATCH: {
    description:
      "PATCH primenjuje delimične izmene " +
      "na postojeći resurs.",
    request:
      "PATCH /api/users/1 HTTP/1.1\n" +
      "Content-Type: application/merge-patch+json\n\n" +
      '{ "name": "Jovana" }',
    status: "200 OK",
    response: {
      id: 1,
      name: "Jovana",
      role: "student"
    }
  },

  DELETE: {
    description:
      "DELETE zahteva uklanjanje resursa " +
      "na navedenoj adresi.",
    request:
      "DELETE /api/users/1 HTTP/1.1\n" +
      "Host: example.com",
    status: "204 No Content",
    response: null
  }
};

function initMethodSimulator() {
  const container = byId("method-tabs");
  if (!container) return;

  const sendButton = byId("method-send");
  let selectedMethod = "GET";

  function selectMethod(method) {
    if (!HTTP_METHODS[method]) return;

    selectedMethod = method;

    const data = HTTP_METHODS[method];

    setActiveButton(container, "data-method", method);

    setText("method-description", data.description);
    setText("method-request", data.request);
    setText("method-response", "Klikni na Pošalji zahtev.");
    setText("method-status", "Spremno");
  }

  container.querySelectorAll("[data-method]").forEach(button => {
    button.addEventListener("click", () => {
      selectMethod(button.dataset.method);
    });
  });

  sendButton?.addEventListener("click", () => {
    const data = HTTP_METHODS[selectedMethod];

    setText("method-status", data.status);

    setText(
      "method-response",
      data.response === null
        ? "(Odgovor nema telo)"
        : formatJSON(data.response)
    );
  });

  selectMethod("GET");
}

/* 12 — HTTP STATUSNI KODOVI */

const HTTP_STATUSES = {
  100: {
    title: "Continue",
    description:
      "Server je primio početni deo zahteva " +
      "i klijent može da nastavi slanje.",
    example: "Privremeni informativni odgovor."
  },

  200: {
    title: "OK",
    description:
      "Zahtev je uspešno obrađen.",
    example: "Uspešno otvaranje web stranice."
  },

  201: {
    title: "Created",
    description:
      "Zahtev je uspeo i kreiran je novi resurs.",
    example: "Uspešno kreiranje novog korisnika."
  },

  204: {
    title: "No Content",
    description:
      "Zahtev je uspešan, ali odgovor nema telo.",
    example: "Uspešno brisanje podataka."
  },

  301: {
    title: "Moved Permanently",
    description:
      "Resurs je trajno premešten na drugu adresu.",
    example: "Trajno preusmeravanje starog URL-a."
  },

  302: {
    title: "Found",
    description:
      "Resurs se privremeno nalazi na drugoj adresi.",
    example: "Privremeno preusmeravanje."
  },

  304: {
    title: "Not Modified",
    description:
      "Resurs se nije promenio prema uslovima zahteva.",
    example: "Browser može koristiti keširanu verziju."
  },

  400: {
    title: "Bad Request",
    description:
      "Server ne može da obradi zahtev " +
      "zbog greške u samom zahtevu.",
    example: "Neispravna sintaksa zahteva."
  },

  401: {
    title: "Unauthorized",
    description:
      "Za pristup je potrebna odgovarajuća autentifikacija.",
    example: "Nedostaju važeći podaci za autentifikaciju."
  },

  403: {
    title: "Forbidden",
    description:
      "Server razume zahtev, ali odbija pristup.",
    example: "Korisnik nema dozvolu za resurs."
  },

  404: {
    title: "Not Found",
    description:
      "Traženi resurs nije pronađen.",
    example: "Stranica sa navedenom putanjom ne postoji."
  },

  429: {
    title: "Too Many Requests",
    description:
      "Klijent je poslao previše zahteva " +
      "u određenom vremenskom periodu.",
    example: "Prekoračenje API ograničenja."
  },

  500: {
    title: "Internal Server Error",
    description:
      "Na serveru je došlo do neočekivane greške.",
    example: "Serverska aplikacija nije uspela da obradi zahtev."
  },

  502: {
    title: "Bad Gateway",
    description:
      "Posrednički server je dobio neispravan " +
      "odgovor od servera kojem se obratio.",
    example: "Problem u komunikaciji između servera."
  },

  503: {
    title: "Service Unavailable",
    description:
      "Server trenutno nije u stanju da obradi zahtev.",
    example: "Privremeno održavanje ili preopterećenje."
  }
};

function initStatusExplorer() {
  const container = byId("status-grid");
  if (!container) return;

  function selectStatus(code) {
    const data = HTTP_STATUSES[code];
    if (!data) return;

    setActiveButton(container, "data-status", String(code));

    setText("status-title", data.title);
    setText("status-description", data.description);
    setText("status-example", data.example);
    setText("status-badge", `${code} ${data.title}`);

    const badge = byId("status-badge");

    if (badge) {
      badge.classList.remove("success", "error");

      if (Number(code) >= 200 && Number(code) < 300) {
        badge.classList.add("success");
      }

      if (Number(code) >= 400) {
        badge.classList.add("error");
      }
    }
  }

  container.querySelectorAll("[data-status]").forEach(button => {
    button.addEventListener("click", () => {
      selectStatus(button.dataset.status);
    });
  });

  selectStatus("200");
}

/* 13 — HTTP / HTTPS POREĐENJE */

const SECURITY_MODES = {
  http: {
    title: "HTTP — bez TLS zaštite",
    description:
      "Kod običnog HTTP-a podaci se ne štite TLS " +
      "enkripcijom. Sadržaj može biti vidljiv " +
      "ili izmenjen tokom prenosa.",
    example:
      "GET /login HTTP/1.1\n" +
      "Host: example.com\n\n" +
      "Podaci se prenose bez TLS enkripcije."
  },

  https: {
    title: "HTTPS — HTTP preko TLS-a",
    description:
      "HTTPS koristi TLS za šifrovanje podataka " +
      "tokom prenosa, proveru identiteta servera " +
      "i zaštitu integriteta komunikacije.",
    example:
      "https://example.com\n\n" +
      "HTTP podaci prolaze kroz zaštićenu TLS vezu."
  }
};

function initSecurityDemo() {
  const container = byId("security-demo");
  if (!container) return;

  function selectProtocol(protocol) {
    const data = SECURITY_MODES[protocol];
    if (!data) return;

    setActiveButton(container, "data-protocol", protocol);

    setText("security-title", data.title);
    setText("security-explanation", data.description);
    setText("security-example", data.example);
  }

  container.querySelectorAll("[data-protocol]").forEach(button => {
    button.addEventListener("click", () => {
      selectProtocol(button.dataset.protocol);
    });
  });

  selectProtocol("https");
}

/* 14 — EVOLUCIJA HTTP PROTOKOLA */

const HTTP_VERSIONS = {
  "1.1": {
    title: "HTTP/1.1",
    description:
      "Široko korišćena verzija sa tekstualnim " +
      "formatom HTTP poruka i trajnim TCP vezama.",
    features:
      "Persistent connections, Host zaglavlje, " +
      "tekstualna struktura poruke.",
    transport: "TCP"
  },

  "2": {
    title: "HTTP/2",
    description:
      "Uvodi binarno uokviravanje i omogućava " +
      "više istovremenih tokova preko jedne veze.",
    features:
      "Multiplexing, HPACK kompresija zaglavlja, " +
      "binarni frejmovi.",
    transport: "TCP"
  },

  "3": {
    title: "HTTP/3",
    description:
      "Koristi QUIC transport umesto TCP-a, " +
      "sa efikasnijim upravljanjem tokovima " +
      "i boljim ponašanjem pri gubitku paketa.",
    features:
      "QUIC, QPACK kompresija zaglavlja, " +
      "nezavisni tokovi.",
    transport: "QUIC preko UDP-a"
  }
};

function initEvolutionDemo() {
  const container = byId("version-demo");
  if (!container) return;

  function selectVersion(version) {
    const data = HTTP_VERSIONS[version];
    if (!data) return;

    setActiveButton(container, "data-version", version);

    setText("version-title", data.title);
    setText("version-description", data.description);
    setText("version-features", data.features);
    setText("version-transport", data.transport);
  }

  container.querySelectorAll("[data-version]").forEach(button => {
    button.addEventListener("click", () => {
      selectVersion(button.dataset.version);
    });
  });

  selectVersion("1.1");
}

/* 15 — STVARNI HTTP GET ZAHTEV */

async function performRealRequest() {
  const button = byId("fetch-button");
  const message = byId("fetch-message");

  const url = new URL(
    "./data/example.json",
    window.location.href
  );

  if (button) {
    button.disabled = true;
    button.textContent = "Slanje zahteva...";
  }

  setText("fetch-status", "Čekanje...");
  setText("fetch-time", "—");
  setText("fetch-headers", "—");
  setText("fetch-body", "—");

  if (message) {
    message.textContent = "Šaljemo stvarni GET zahtev...";
  }

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store"
    });

    const responseText = await response.text();
    const duration = performance.now() - startTime;

    setText(
      "fetch-status",
      `${response.status} ${response.statusText}`.trim()
    );

    setText("fetch-time", `${duration.toFixed(1)} ms`);

    const headerLines = [];

    response.headers.forEach((value, key) => {
      headerLines.push(`${key}: ${value}`);
    });

    setText(
      "fetch-headers",
      headerLines.join("\n") ||
      "Nema dostupnih zaglavlja."
    );

    let formattedBody = responseText;

    try {
      formattedBody = formatJSON(JSON.parse(responseText));
    } catch {
      // Ako odgovor nije JSON, prikazujemo originalni tekst.
    }

    setText(
      "fetch-body",
      formattedBody || "(Prazno telo odgovora)"
    );

    if (message) {
      message.textContent = response.ok
        ? "Stvarni HTTP zahtev je uspešno završen."
        : "Server je odgovorio, ali status označava problem.";
    }
  } catch (error) {
    setText("fetch-status", "Network error");

    if (window.location.protocol === "file:") {
      if (message) {
        message.textContent =
          "Otvori projekat preko lokalnog HTTP servera " +
          "(na primer VS Code Live Server) ili GitHub Pages. " +
          "Browser može blokirati fetch za file:// stranice.";
      }
    } else if (message) {
      message.textContent =
        "Zahtev nije uspeo. Proveri internet konekciju, " +
        "adresu i da li postoji data/example.json.";
    }

    console.error("HTTP demonstracija:", error);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Pošalji GET zahtev →";
    }
  }
}

function initFetchDemo() {
  const container = byId("fetch-demo");
  if (!container) return;

  const button = byId("fetch-button");

  button?.addEventListener("click", performRealRequest);
}

/* 16 — PITANJA ZA KVIZ */

const QUIZ_QUESTIONS = [
  {
    question: "Šta znači skraćenica HTTP?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Program",
      "Hyperlink Transmission Process",
      "Host Transfer Technology Protocol"
    ],
    correct: 0,
    explanation:
      "HTTP je skraćenica za HyperText Transfer Protocol."
  },

  {
    question: "Koja HTTP metoda se koristi za preuzimanje podataka?",
    options: [
      "POST",
      "DELETE",
      "GET",
      "PATCH"
    ],
    correct: 2,
    explanation:
      "GET zahteva predstavljanje određenog resursa."
  },

  {
    question: "Šta znači HTTP status 404?",
    options: [
      "Zahtev je uspešan",
      "Resurs nije pronađen",
      "Server je trajno premešten",
      "Zahtev je kreirao novi resurs"
    ],
    correct: 1,
    explanation:
      "404 Not Found znači da traženi resurs nije pronađen."
  },

  {
    question: "Šta HTTPS koristi za zaštitu komunikacije?",
    options: [
      "HTML",
      "CSS",
      "TLS",
      "JSON"
    ],
    correct: 2,
    explanation:
      "HTTPS koristi TLS za zaštitu podataka u prenosu."
  },

  {
    question: "Koji transport koristi HTTP/3?",
    options: [
      "Samo TCP",
      "QUIC preko UDP-a",
      "FTP",
      "SMTP"
    ],
    correct: 1,
    explanation:
      "HTTP/3 koristi QUIC, koji funkcioniše preko UDP-a."
  }
];

/* 17 — FUNKCIONALNOST KVIZA */

function initQuiz() {
  const app = byId("quiz-app");
  if (!app) return;

  const questionElement = byId("quiz-question");
  const optionsElement = byId("quiz-options");
  const feedbackElement = byId("quiz-feedback");
  const nextButton = byId("quiz-next");

  const contentElement = byId("quiz-content");
  const resultElement = byId("quiz-result");
  const restartButton = byId("quiz-restart");

  if (!questionElement || !optionsElement) return;

  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function updateProgress() {
    const progress = byId("quiz-progress-fill");

    if (progress) {
      progress.style.width =
        `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%`;
    }

    setText(
      "quiz-counter",
      `Pitanje ${Math.min(currentQuestion + 1, QUIZ_QUESTIONS.length)} ` +
      `/ ${QUIZ_QUESTIONS.length}`
    );
  }

  function renderQuestion() {
    answered = false;

    const data = QUIZ_QUESTIONS[currentQuestion];

    questionElement.textContent = data.question;
    optionsElement.innerHTML = "";

    if (feedbackElement) {
      feedbackElement.textContent = "";
    }

    if (nextButton) {
      nextButton.disabled = true;
      nextButton.textContent =
        currentQuestion === QUIZ_QUESTIONS.length - 1
          ? "Prikaži rezultat →"
          : "Sledeće pitanje →";
    }

    data.options.forEach((option, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;

      button.addEventListener("click", () => {
        selectAnswer(index);
      });

      optionsElement.appendChild(button);
    });

    updateProgress();
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const data = QUIZ_QUESTIONS[currentQuestion];
    const correct = selectedIndex === data.correct;

    if (correct) score++;

    const buttons =
      optionsElement.querySelectorAll(".quiz-option");

    buttons.forEach((button, index) => {
      button.disabled = true;

      if (index === data.correct) {
        button.classList.add("correct");
      } else if (index === selectedIndex) {
        button.classList.add("incorrect");
      }
    });

    if (feedbackElement) {
      feedbackElement.textContent =
        (correct ? "Tačno! " : "Netačno. ") +
        data.explanation;

      feedbackElement.style.color = correct
        ? "var(--success)"
        : "var(--danger)";
    }

    if (nextButton) {
      nextButton.disabled = false;
    }
  }

  function showResult() {
    contentElement?.classList.add("hidden");
    resultElement?.classList.remove("hidden");

    setText(
      "quiz-score",
      `${score} / ${QUIZ_QUESTIONS.length}`
    );

    const progress = byId("quiz-progress-fill");

    if (progress) {
      progress.style.width = "100%";
    }

    setText("quiz-counter", "Kviz je završen");
  }

  nextButton?.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion >= QUIZ_QUESTIONS.length) {
      showResult();
    } else {
      renderQuestion();
    }
  });

  restartButton?.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    answered = false;

    resultElement?.classList.add("hidden");
    contentElement?.classList.remove("hidden");

    renderQuestion();
  });

  renderQuestion();
}

/* ==========================================
   17A — ŠTA JE HTTP?
   INTERAKTIVNE DEMONSTRACIJE
   ========================================== */

function initWhatIsHTTP() {
  const conceptContainer = byId("concept-tabs");
  const urlContainer = byId("url-address");

  // Ostale stranice nemaju ove elemente.
  if (!conceptContainer || !urlContainer) return;

  /* 1 — REQUEST / RESPONSE / HTML PRIKAZ */

  const conceptData = {
    request: {
      number: "KORAK 01",
      title: "Browser traži resurs",
      description:
        "Browser šalje GET zahtev serveru. " +
        "Traži dokument index.html i navodi " +
        "da prihvata HTML sadržaj.",
      tag: "Klijent → Server",
      display: "HTTP/1.1 Request",
      code:
        "GET /index.html HTTP/1.1\n" +
        "Host: example.com\n" +
        "Accept: text/html"
    },

    response: {
      number: "KORAK 02",
      title: "Server vraća HTML",
      description:
        "Server odgovara statusom 200 OK " +
        "i vraća HTML dokument kao telo " +
        "HTTP odgovora. HTTP je način prenosa, " +
        "a HTML je jedan od mogućih sadržaja.",
      tag: "Server → Klijent",
      display: "HTTP/1.1 Response",
      code:
        "HTTP/1.1 200 OK\n" +
        "Content-Type: text/html\n\n" +
        "<!DOCTYPE html>\n" +
        "<html lang=\"sr\">\n" +
        "  <body>\n" +
        "    <h1>Moja web stranica</h1>\n" +
        "    <p>Dobrodošli!</p>\n" +
        "  </body>\n" +
        "</html>"
    },

    render: {
      number: "KORAK 03",
      title: "Browser prikazuje stranicu",
      description:
        "Browser parsira HTML dokument, " +
        "gradi strukturu stranice i prikazuje " +
        "je korisniku. Ako dokument koristi " +
        "CSS, slike ili JavaScript, browser " +
        "može poslati dodatne zahteve.",
      tag: "HTML → Vizuelni prikaz",
      display: "Browser Preview",
      code: ""
    }
  };

  const conceptCode = byId("concept-code");
  const conceptPreview = byId("concept-preview");

  function selectConcept(key) {
    const item = conceptData[key];
    if (!item) return;

    setActiveButton(conceptContainer, "data-concept", key);

    setText("concept-number", item.number);
    setText("concept-heading", item.title);
    setText("concept-description", item.description);
    setText("concept-tag", item.tag);
    setText("concept-display-title", item.display);

    const showPreview = key === "render";

    if (conceptCode) {
      conceptCode.hidden = showPreview;

      if (!showPreview) {
        conceptCode.textContent = item.code;
      }
    }

    if (conceptPreview) {
      conceptPreview.hidden = !showPreview;
    }
  }

  conceptContainer
    .querySelectorAll("[data-concept]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectConcept(button.dataset.concept);
      });
    });

  selectConcept("request");

  /* 2 — ANATOMIJA URL ADRESE */

  const urlParts = {
    scheme: {
      title: "Šema / protokol",
      description:
        "https označava pristup web resursu " +
        "preko HTTP-a zaštićenog TLS-om. " +
        "Za razliku od običnog http, " +
        "komunikacija je šifrovana."
    },

    host: {
      title: "Domen / Host",
      description:
        "example.com predstavlja domen " +
        "servera kojem želimo da pristupimo. " +
        "DNS može pomoći da se taj domen " +
        "prevede u odgovarajuću IP adresu."
    },

    path: {
      title: "Putanja do resursa",
      description:
        "/lekcije/http.html predstavlja putanju " +
        "koja označava traženi resurs. " +
        "Ne mora nužno da odgovara stvarnom " +
        "fajlu na disku servera."
    },

    query: {
      title: "Parametri upita",
      description:
        "?mode=demo je query string. " +
        "On može serveru ili aplikaciji " +
        "proslediti dodatne parametre, " +
        "na primer izbor režima prikaza."
    }
  };

  function selectURLPart(key) {
    const part = urlParts[key];
    if (!part) return;

    setActiveButton(urlContainer, "data-url-part", key);

    setText("url-part-title", part.title);
    setText("url-part-description", part.description);
  }

  urlContainer
    .querySelectorAll("[data-url-part]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectURLPart(button.dataset.urlPart);
      });
    });

  selectURLPart("scheme");
}

/* 18 — POKRETANJE CELOG SAJTA */

function initializeWebsite() {
  renderBackground();
  renderHeader();
  renderFooter();
  renderLessonNavigation();

  initKeyboardNavigation();
  initOrbitNavigation();
  initWhatIsHTTP();

  initHTTPFlow();
  initHTTPParts();
  initMethodSimulator();
  initStatusExplorer();
  initSecurityDemo();
  initEvolutionDemo();
  initFetchDemo();
  initQuiz();

  console.info(
    "HTTP PROTOKOL — Interaktivna prezentacija je učitana."
  );
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeWebsite
  );
} else {
  initializeWebsite();
}
