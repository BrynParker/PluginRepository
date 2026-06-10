const colorSets = [
  "80, 228, 255",
  "255, 189, 85",
  "115, 240, 179",
  "255, 107, 139",
  "169, 121, 255",
  "255, 247, 209",
];

const page = document.body.dataset.page;
const dialog = document.querySelector("#product-dialog");
const dialogContent = document.querySelector("#dialog-content");

initParticles();
bindProductDetails();
cycleTerminal();
initReveals();
initSmoothCarousel();
initInterfaceRotator();

if (page === "catalog") {
  bindCatalog();
}

function bindCatalog() {
  const grid = document.querySelector("#product-grid");
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#search-input");
  const sort = document.querySelector("#sort-select");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-product-card]")];
  const params = new URLSearchParams(window.location.search);
  let activeFilter = params.get("filter") || "all";

  if (params.has("q")) {
    search.value = params.get("q");
  }

  filters.forEach((filter) => filter.classList.toggle("active", filter.dataset.filter === activeFilter));
  if (!filters.some((filter) => filter.dataset.filter === activeFilter)) {
    activeFilter = "all";
    filters.forEach((filter) => filter.classList.toggle("active", filter.dataset.filter === activeFilter));
  }

  function update() {
    const query = search.value.trim().toLowerCase();
    let visible = cards.filter((card) => {
      const matchesQuery = !query || card.dataset.search.includes(query);
      const matchesFilter = activeFilter === "all" || card.dataset.status === activeFilter;
      return matchesQuery && matchesFilter;
    });

    visible.sort((a, b) => {
      if (sort.value === "name") return a.dataset.name.localeCompare(b.dataset.name);
      if (sort.value === "price-high") return Number(b.dataset.priceMin) - Number(a.dataset.priceMin);
      if (sort.value === "price-low") return Number(a.dataset.priceMin) - Number(b.dataset.priceMin);
      return Number(b.dataset.priceMin) - Number(a.dataset.priceMin) || a.dataset.name.localeCompare(b.dataset.name);
    });

    for (const card of cards) {
      card.hidden = true;
    }
    for (const card of visible) {
      card.hidden = false;
      grid.append(card);
    }

    count.textContent = `${visible.length.toLocaleString()} products shown from ${cards.length.toLocaleString()} embedded products`;
  }

  search.addEventListener("input", update);
  sort.addEventListener("change", update);
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filters.forEach((filter) => filter.classList.toggle("active", filter === button));
      update();
    });
  });

  update();
}

function bindProductDetails() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-detail]");
    if (!button) return;

    dialogContent.innerHTML = `
      <p class="eyebrow">${escapeHtml(button.closest("[data-product-card]")?.dataset.status || "product")}</p>
      <h2>${escapeHtml(button.dataset.name)}</h2>
      <p>${escapeHtml(button.dataset.description)}</p>
      <dl>
        <dt>Price</dt>
        <dd>${escapeHtml(button.dataset.price)}</dd>
        <dt>Found in</dt>
        <dd>${escapeHtml(button.dataset.found)}</dd>
        <dt>Notes</dt>
        <dd>${escapeHtml(button.dataset.notes)}</dd>
      </dl>
    `;
    dialog.showModal();
  });

  dialog?.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
}

function cycleTerminal() {
  const terminal = document.querySelector("#terminal-line");
  if (!terminal) return;

  const lines = [
    "59 root plugins staged for launch",
    "flagship systems, helper tools, and UI suites indexed",
    "catalog page uses embedded product cards",
    "pricing ready for individual product edits",
  ];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % lines.length;
    terminal.textContent = lines[index];
  }, 2400);
}

function initSmoothCarousel() {
  const rail = document.querySelector(".hero-carousel .auto-rail");
  if (!rail) return;

  let originals = [...rail.children].filter((card) => card.getAttribute("aria-hidden") !== "true");
  if (!originals.length) originals = [...rail.children];
  if ([...rail.children].filter((card) => card.getAttribute("aria-hidden") === "true").length < originals.length) {
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      rail.appendChild(clone);
    });
  }

  function measure() {
    const firstDuplicate = rail.children[originals.length];
    const wrapAt = firstDuplicate ? firstDuplicate.offsetLeft : rail.scrollWidth / 2;
    if (wrapAt > 0) {
      rail.style.setProperty("--carousel-distance", `${wrapAt}px`);
      rail.style.setProperty("--carousel-duration", `${Math.max(34, wrapAt / 58)}s`);
    }
  }

  window.addEventListener("resize", measure);
  requestAnimationFrame(measure);
}

function initInterfaceRotator() {
  const shots = [...document.querySelectorAll(".work-shot")];
  if (!shots.length) return;

  const rotationIntervalMs = 15000;
  const interfaces = [
    ["1.webp", "Inventory", "Dense item management screens"],
    ["2.webp", "Character UI", "Polished identity and progression flows"],
    ["3.webp", "Admin Tools", "Operational panels for staff workflows"],
    ["4.webp", "Vendors", "Storefront interfaces with clean purchase states"],
    ["5.webp", "Crafting", "Recipe-driven systems with clear feedback"],
    ["6.webp", "Banking", "Economy screens built for roleplay servers"],
    ["7.webp", "Dialogue", "Interactive NPC and world UI"],
    ["8.webp", "Roleplay UI", "Immersive interface systems"],
    ["9.webp", "Dispatch", "Server tools with fast scanning layouts"],
    ["10.webp", "Terminals", "In-world menus with styled command surfaces"],
    ["11.webp", "Faction Tools", "Access-controlled screens for teams"],
    ["12.webp", "Progression", "Leveling and rewards presented cleanly"],
    ["13.webp", "Products", "Polished systems for sale"],
    ["14.webp", "Gameplay", "Server-ready feature work"],
    ["15.webp", "Character Tools", "Creation and customization interfaces"],
    ["16.webp", "Menus", "Custom flows and panels"],
    ["17.webp", "Notifications", "Readable feedback without visual clutter"],
    ["1B938BAD5B0CA3A2.jpg", "Showcase", "Finished work presented in-game"],
    ["20260218192211_1.jpg", "Worlds", "Roleplay environments"],
    ["20260226184602_1.jpg", "Scenes", "Atmospheric server moments"],
    ["3EB422B91639BEB6.jpg", "Systems", "Feature work inside live servers"],
    ["51ED806FC4E3F0A6.jpg", "Immersion", "Visual polish around player actions"],
  ];
  let cursor = shots.length;

  interfaces.forEach(([file]) => {
    const image = new Image();
    image.src = `./assets/img/${file}`;
  });

  function rotateInterfaces() {
    shots.forEach((shot, index) => {
      const [file, label, title] = interfaces[(cursor + index) % interfaces.length];
      const img = shot.querySelector("img");
      const eyebrow = shot.querySelector("figcaption span");
      const heading = shot.querySelector("figcaption strong");
      if (!img || !eyebrow || !heading) return;

      shot.classList.add("is-swapping");
      setTimeout(() => {
        img.src = `./assets/img/${file}`;
        img.alt = `${label} interface preview`;
        eyebrow.textContent = label;
        heading.textContent = title;
        shot.classList.remove("is-swapping");
      }, 320);
    });
    cursor = (cursor + shots.length) % interfaces.length;
  }

  setInterval(rotateInterfaces, rotationIntervalMs);
}

function initReveals() {
  const revealTargets = [
    ".stats-band",
    ".about-panel",
    ".work-head",
    ".work-shot",
    ".section-head",
    ".launch-cta",
  ];
  const elements = document.querySelectorAll(revealTargets.join(","));
  if (!elements.length) return;

  elements.forEach((element) => element.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  elements.forEach((element) => observer.observe(element));
}

function initParticles() {
  const canvas = document.querySelector("#particle-field");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 16)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.28 * devicePixelRatio,
      r: (Math.random() * 1.9 + 0.6) * devicePixelRatio,
      c: colorSets[Math.floor(Math.random() * colorSets.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${particle.c}, 0.45)`;
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
