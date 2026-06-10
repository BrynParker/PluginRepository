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
      <h2>${escapeHtml(button.dataset.name)}</h2>
      <p>${escapeHtml(button.dataset.longDescription || button.dataset.description)}</p>
      <dl>
        <dt>Price</dt>
        <dd>${escapeHtml(button.dataset.price)}</dd>
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
  const rails = [...document.querySelectorAll(".auto-carousel .auto-rail")];
  if (!rails.length) return;

  rails.forEach((rail) => {
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
      const speed = Number(rail.dataset.speed || 58);
      if (wrapAt > 0) {
        rail.style.setProperty("--carousel-distance", `${wrapAt}px`);
        rail.style.setProperty("--carousel-duration", `${Math.max(34, wrapAt / speed)}s`);
      }
    }

    window.addEventListener("resize", measure);
    requestAnimationFrame(measure);
  });
}

function initReveals() {
  const revealTargets = [
    ".stats-band",
    ".about-panel",
    ".work-head",
    ".media-frame",
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
