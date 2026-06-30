import { RATU_ASSETS, assetUrl, getGameCover, getEmulatorImage } from "./data/ratu-assets.js";

const $ = (id) => document.getElementById(id);

const pageTitle = $("pageTitle");
const pageSubtitle = $("pageSubtitle");
const splash = $("splash");
const app = $("app");

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

const homeFeatureGrid = $("homeFeatureGrid");
const recentGamesGrid = $("recentGamesGrid");
const homeEmulatorsGrid = $("homeEmulatorsGrid");

const foldersGrid = $("foldersGrid");
const savesList = $("savesList");
const emptySaves = $("emptySaves");
const saveDetailPanel = $("saveDetailPanel");

const emulatorList = $("emulatorList");
const saveSearchInput = $("saveSearchInput");
const filterRecentButton = $("filterRecentButton");
const sortSelect = $("sortSelect");

const viewAllSavesButton = $("viewAllSavesButton");
const homeEmulatorsButton = $("homeEmulatorsButton");
const savesAddRomButton = $("savesAddRomButton");
const emptyAddButton = $("emptyAddButton");

const uploadBox = $("uploadBox");
const romInput = $("romInput");
const coverInput = $("coverInput") || createCoverInput();

const addEmulatorButton = $("addEmulatorButton");
const resetDefaultEmulatorsButton = $("resetDefaultEmulatorsButton");
const toast = $("toast");

const STORAGE_LIBRARY = "ratu_library_aligned_v1";
const STORAGE_EMULATORS = "ratu_emulators_aligned_v1";

let selectedGameId = "";
let currentSearch = "";
let onlyRecent = false;
let pendingCoverGameId = "";

const pageInfo = {
  home: ["Início", "Seu painel rápido do Ratu Launcher."],
  saves: ["Saves", "Gerencie, organize e sincronize seus saves."],
  "new-rom": ["Nova ROM", "Adicione uma ROM e deixe o Ratu criar o card."],
  about: ["Sobre", "Mais informações sobre o Ratu Launcher."],
  emulators: ["Emuladores", "Gerencie seus emuladores. Instale apenas os que você quer usar."],
};

const navAssets = {
  home: [RATU_ASSETS.menu.home, RATU_ASSETS.menu.homeActive],
  saves: [RATU_ASSETS.menu.saves, RATU_ASSETS.menu.savesActive],
  "new-rom": [RATU_ASSETS.menu.newRom, RATU_ASSETS.menu.newRomActive],
  about: [RATU_ASSETS.menu.about, RATU_ASSETS.menu.aboutActive],
  emulators: [RATU_ASSETS.menu.emulators, RATU_ASSETS.menu.emulatorsActive],
};

const systemByExtension = {
  gba: ["GBA", "mgba", "mGBA"],
  gb: ["GB", "mgba", "mGBA"],
  gbc: ["GBC", "mgba", "mGBA"],
  nds: ["Nintendo DS", "melonds", "melonDS"],
  dsi: ["Nintendo DS", "melonds", "melonDS"],
  "3ds": ["Nintendo 3DS", "azahar", "Azahar"],
  cia: ["Nintendo 3DS", "azahar", "Azahar"],
  cci: ["Nintendo 3DS", "azahar", "Azahar"],
  cxi: ["Nintendo 3DS", "azahar", "Azahar"],
  n64: ["N64", "mupen64plus", "Mupen64"],
  z64: ["N64", "mupen64plus", "Mupen64"],
  v64: ["N64", "mupen64plus", "Mupen64"],
  snes: ["SNES", "snes9x", "Snes9x"],
  smc: ["SNES", "snes9x", "Snes9x"],
  sfc: ["SNES", "snes9x", "Snes9x"],
  nes: ["NES", "nestopia", "FCEUX"],
  cue: ["PS1", "duckstation", "DuckStation"],
  bin: ["PS1", "duckstation", "DuckStation"],
  iso: ["PSP", "ppsspp", "PPSSPP"],
  cso: ["PSP", "ppsspp", "PPSSPP"],
  wbfs: ["Wii", "dolphin", "Dolphin"],
  gcm: ["GameCube", "dolphin", "Dolphin"],
};

const defaultEmulators = [
  ["mgba", "mGBA", "Atual", ["GBA", "GB", "GBC"]],
  ["melonds", "melonDS", "Atual", ["Nintendo DS"]],
  ["mupen64plus", "Mupen64", "Atual", ["N64"]],
  ["azahar", "Azahar", "Atual", ["Nintendo 3DS"]],
  ["snes9x", "Snes9x", "Atual", ["SNES"]],
  ["dolphin", "Dolphin", "Atual", ["GameCube", "Wii"]],
  ["ppsspp", "PPSSPP", "Atual", ["PSP"]],
  ["duckstation", "DuckStation", "Atual", ["PS1"]],
  ["nestopia", "FCEUX", "Atual", ["NES"]],
].map(([id, name, version, systems]) => ({
  id,
  name,
  version,
  systems,
  exePath: "",
  folderPath: "",
  status: "Pendente",
}));

start();

function start() {
  applyStaticAssets();
  seedStorage();
  setupEvents();

  setTimeout(() => {
    splash?.classList.add("hidden");
    app?.classList.remove("hidden");
    setPage("home");
  }, 300);
}

function applyStaticAssets() {
  setImage("splashRat", RATU_ASSETS.logo.full);
  setImage("brandRat", RATU_ASSETS.logo.full);
  setImage("playerRat", RATU_ASSETS.logo.full);
  setImage("uploadRat", RATU_ASSETS.logo.full);
  setImage("aboutRat", RATU_ASSETS.logo.full);

  document.documentElement.style.setProperty(
    "--player-card",
    `url("${assetUrl(RATU_ASSETS.saves.playerCard)}")`
  );

  renderNavImages("home");
}

function setupEvents() {
  navItems.forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  viewAllSavesButton?.addEventListener("click", () => setPage("saves"));
  homeEmulatorsButton?.addEventListener("click", () => setPage("emulators"));
  savesAddRomButton?.addEventListener("click", () => setPage("new-rom"));
  emptyAddButton?.addEventListener("click", () => setPage("new-rom"));

  uploadBox?.addEventListener("click", selectRom);
  romInput?.addEventListener("change", () => {
    const file = romInput.files?.[0];
    if (!file) return;
    addRomFromBrowserFile(file);
    romInput.value = "";
  });

  coverInput.addEventListener("change", () => {
    const file = coverInput.files?.[0];
    if (!file || !pendingCoverGameId) return;

    const reader = new FileReader();
    reader.onload = () => {
      setGameCover(pendingCoverGameId, String(reader.result));
      pendingCoverGameId = "";
      coverInput.value = "";
    };
    reader.readAsDataURL(file);
  });

  saveSearchInput?.addEventListener("input", () => {
    currentSearch = saveSearchInput.value.trim().toLowerCase();
    renderSavesPage();
  });

  filterRecentButton?.addEventListener("click", () => {
    onlyRecent = !onlyRecent;
    filterRecentButton.textContent = onlyRecent ? "Todos" : "Filtros";
    renderSavesPage();
  });

  sortSelect?.addEventListener("change", renderSavesPage);
  addEmulatorButton?.addEventListener("click", addCustomEmulator);
  resetDefaultEmulatorsButton?.addEventListener("click", resetEmulators);
}

function setPage(page) {
  const info = pageInfo[page];
  if (!info) return;

  pageTitle.textContent = info[0];
  pageSubtitle.textContent = info[1];

  pages.forEach((p) => p.classList.toggle("active", p.id === `page-${page}`));
  navItems.forEach((b) => b.classList.toggle("active", b.dataset.page === page));

  renderNavImages(page);
  renderAll();
}

function renderNavImages(activePage) {
  navItems.forEach((button) => {
    const page = button.dataset.page;
    const pair = navAssets[page];
    if (!pair) return;

    const src = page === activePage ? pair[1] : pair[0];
    button.innerHTML = `<img class="nav-img" src="${assetUrl(src)}" alt="${page}" />`;
  });
}

function renderAll() {
  renderHomeCards();
  renderRecentGames();
  renderHomeEmulators();
  renderSavesPage();
  renderEmulators();
}

function renderHomeCards() {
  if (!homeFeatureGrid) return;

  const cards = [
    [RATU_ASSETS.home.cardSaves, "Saves", "Gerencie e organize seus arquivos de jogo.", "Abrir", "saves"],
    [RATU_ASSETS.home.cardNovaRom, "Nova ROM", "Adicione uma nova ROM e comece a jogar.", "Adicionar", "new-rom"],
    [RATU_ASSETS.home.cardSobre, "Sobre", "Saiba mais sobre o Ratu Launcher.", "Abrir", "about"],
  ];

  homeFeatureGrid.innerHTML = cards.map(([img, title, desc, action, page]) => `
    <button class="home-feature-card" data-page-go="${page}">
      <img class="asset-base" src="${assetUrl(img)}" alt="" />
      <div class="asset-title">${escapeHtml(title)}</div>
      <div class="asset-desc">${escapeHtml(desc)}</div>
      <div class="asset-action">${escapeHtml(action)} →</div>
    </button>
  `).join("");

  homeFeatureGrid.querySelectorAll("[data-page-go]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.pageGo));
  });
}

function renderRecentGames() {
  if (!recentGamesGrid) return;

  const library = getLibrary().slice(0, 6);

  if (library.length === 0) {
    recentGamesGrid.innerHTML = "";
    return;
  }

  recentGamesGrid.innerHTML = library.map(createGameCard).join("");

  recentGamesGrid.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleGameAction(button.dataset.action, button.dataset.id));
  });
}

function createGameCard(game) {
  const cover = getGameCover(game);
  const emulatorImg = getEmulatorImage(game.emulatorId);

  return `
    <article class="game-card">
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.home.gameCard)}" alt="" />

      <div class="game-cover-box">
        <img class="cover-img" src="${cover}" alt="${escapeAttr(game.title)}" />
        <span class="emulator-badge">
          <img src="${emulatorImg}" alt="" />
          ${escapeHtml(game.system)}
        </span>
      </div>

      <div class="game-title">${escapeHtml(game.title)}</div>
      <div class="game-system">${escapeHtml(shortSystem(game.system))}</div>

      <button class="dots" data-action="details" data-id="${escapeAttr(game.id)}">⋮</button>
    </article>
  `;
}

function renderHomeEmulators() {
  if (!homeEmulatorsGrid) return;

  homeEmulatorsGrid.innerHTML = getEmulators().slice(0, 4).map((emu) => `
    <article class="home-emulator-card">
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.home.emulatorCard)}" alt="" />
      <img class="emu-img" src="${getEmulatorImage(emu.id)}" alt="${escapeAttr(emu.name)}" />
      <div class="emu-name">${escapeHtml(emu.name)}</div>
      <div class="emu-version">Versão ${escapeHtml(emu.version || "Atual")}</div>
      <div class="emu-status">${emu.exePath ? "Instalado" : "Não instalado"}</div>
    </article>
  `).join("");
}

function renderSavesPage() {
  renderFolders();

  if (!savesList) return;

  let library = getLibrary();

  if (currentSearch) {
    library = library.filter((game) => {
      const text = `${game.title} ${game.system} ${game.emulator}`.toLowerCase();
      return text.includes(currentSearch);
    });
  }

  if (onlyRecent) {
    library = library.filter((game) => ["Novo", "Hoje", "Agora"].includes(game.lastPlayed));
  }

  if (sortSelect?.value === "name") {
    library.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortSelect?.value === "system") {
    library.sort((a, b) => a.system.localeCompare(b.system));
  }

  if (library.length === 0) {
    savesList.innerHTML = "";
    emptySaves?.classList.remove("hidden");
    renderDetailPanel(null);
    return;
  }

  emptySaves?.classList.add("hidden");

  if (!selectedGameId) selectedGameId = library[0].id;

  savesList.innerHTML = library.map(createSaveRow).join("");

  savesList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleGameAction(button.dataset.action, button.dataset.id));
  });

  renderDetailPanel(getLibrary().find((g) => g.id === selectedGameId) || library[0]);
}

function renderFolders() {
  if (!foldersGrid) return;

  const library = getLibrary();

  const folders = [
    ["Pokémon", countByTitle(library, ["pokemon", "pokémon"])],
    ["Mario", countByTitle(library, ["mario"])],
    ["Zelda", countByTitle(library, ["zelda"])],
    ["Favoritos", library.filter((g) => g.favorite).length],
  ];

  foldersGrid.innerHTML = folders.map(([name, count]) => `
    <article class="folder-card">
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.saves.folderCard)}" alt="" />
      <div class="folder-title">${escapeHtml(name)}</div>
      <div class="folder-count">${count} saves</div>
    </article>
  `).join("");
}

function createSaveRow(game) {
  return `
    <article class="save-row">
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.saves.saveRow)}" alt="" />

      <div class="save-row-cover">
        <img src="${getGameCover(game)}" alt="${escapeAttr(game.title)}" />
      </div>

      <div class="save-row-info">
        <span class="pill">${escapeHtml(game.system)}</span>
        <h4>${escapeHtml(game.title)}</h4>
        <p>Última jogada: ${escapeHtml(game.lastPlayed)}<br />Tempo de jogo: ${escapeHtml(game.playTime)}</p>
      </div>

      <button class="play-button" data-action="play" data-id="${escapeAttr(game.id)}">▶ Jogar</button>
      <button class="row-button" data-action="cover" data-id="${escapeAttr(game.id)}">Capa</button>
      <button class="menu-button" data-action="details" data-id="${escapeAttr(game.id)}">⋮</button>
    </article>
  `;
}

function renderDetailPanel(game) {
  if (!saveDetailPanel) return;

  if (!game) {
    saveDetailPanel.innerHTML = `
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.panels.darkPanel)}" alt="" />
      <h3>Nenhum save</h3>
      <p>Adicione uma ROM primeiro.</p>
    `;
    return;
  }

  saveDetailPanel.innerHTML = `
    <img class="asset-base" src="${assetUrl(RATU_ASSETS.panels.darkPanel)}" alt="" />

    <div class="detail-cover">
      <img src="${getGameCover(game)}" alt="${escapeAttr(game.title)}" />
    </div>

    <h3>${escapeHtml(game.title)}</h3>
    <p class="pill">${escapeHtml(game.system)}</p>

    <p>📅 Última jogada<br /><strong>${escapeHtml(game.lastPlayed)}</strong></p>
    <p>⏱ Tempo de jogo<br /><strong>${escapeHtml(game.playTime)}</strong></p>
    <p>📁 ROM<br /><strong>${escapeHtml(game.romPath || "sem caminho real")}</strong></p>

    <div style="display:grid;gap:10px;margin-top:20px;">
      <button class="primary-button" data-action="play" data-id="${escapeAttr(game.id)}">Jogar</button>
      <button class="outline-button" data-action="cover" data-id="${escapeAttr(game.id)}">Trocar capa</button>
      <button class="danger-button" data-action="delete" data-id="${escapeAttr(game.id)}">Apagar</button>
    </div>
  `;

  saveDetailPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleGameAction(button.dataset.action, button.dataset.id));
  });
}

function renderEmulators() {
  if (!emulatorList) return;

  emulatorList.innerHTML = getEmulators().map((emu) => `
    <article class="emulator-card">
      <img class="asset-base" src="${assetUrl(RATU_ASSETS.panels.emulatorCard)}" alt="" />
      <img class="emu-device" src="${getEmulatorImage(emu.id)}" alt="${escapeAttr(emu.name)}" />

      <div class="emu-card-name">${escapeHtml(emu.name)}</div>
      <div class="emu-card-version">Versão ${escapeHtml(emu.version || "Atual")}</div>
      <div class="emu-card-status">${emu.exePath ? "Instalado" : "Não instalado"}</div>

      <button class="config-btn" data-action="config" data-id="${escapeAttr(emu.id)}">Configurar</button>
      <button class="remove-btn" data-action="remove" data-id="${escapeAttr(emu.id)}">Remover</button>
    </article>
  `).join("");

  emulatorList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleEmulatorAction(button.dataset.action, button.dataset.id));
  });
}

async function selectRom() {
  if (!isTauriReady()) {
    romInput?.click();
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");

    const selected = await open({
      multiple: false,
      directory: false,
      title: "Escolha uma ROM",
      filters: [
        {
          name: "ROMs",
          extensions: Object.keys(systemByExtension),
        },
        {
          name: "Todos",
          extensions: ["*"],
        },
      ],
    });

    if (!selected || Array.isArray(selected)) return;

    addRomFromPath(selected);
  } catch {
    romInput?.click();
  }
}

function addRomFromBrowserFile(file) {
  const ext = getExtension(file.name);
  const detected = systemByExtension[ext] || ["ROM", "manual", "Manual"];

  addGame({
    title: cleanTitle(file.name),
    fileName: file.name,
    romPath: "",
    extension: ext,
    system: detected[0],
    emulatorId: detected[1],
    emulator: detected[2],
  });
}

function addRomFromPath(path) {
  const fileName = getFileName(path);
  const ext = getExtension(fileName);
  const detected = systemByExtension[ext] || ["ROM", "manual", "Manual"];

  addGame({
    title: cleanTitle(fileName),
    fileName,
    romPath: path,
    extension: ext,
    system: detected[0],
    emulatorId: detected[1],
    emulator: detected[2],
  });
}

function addGame(data) {
  const game = normalizeGame({
    ...data,
    id: createId(data.title),
    coverPath: "",
    lastPlayed: "Novo",
    playTime: "0h 0m",
    createdAt: new Date().toISOString(),
  });

  const library = getLibrary();
  library.unshift(game);

  selectedGameId = game.id;
  saveLibrary(library);

  setPage("saves");
  showToast(`Adicionado: ${game.title}`);
}

function handleGameAction(action, id) {
  const library = getLibrary();
  const game = library.find((g) => g.id === id);

  if (!game) return;

  selectedGameId = id;

  if (action === "details") {
    setPage("saves");
    renderAll();
    return;
  }

  if (action === "cover") {
    pendingCoverGameId = id;
    coverInput.click();
    return;
  }

  if (action === "delete") {
    if (!confirm(`Apagar ${game.title}?`)) return;
    saveLibrary(library.filter((g) => g.id !== id));
    selectedGameId = "";
    renderAll();
    return;
  }

  if (action === "play") {
    showToast("Abrir jogo real fica ligado no Tauri/Rust.");
  }
}

function setGameCover(id, cover) {
  const library = getLibrary();
  const game = library.find((g) => g.id === id);

  if (!game) return;

  game.coverPath = cover;
  saveLibrary(library);
  renderAll();
  showToast("Capa aplicada.");
}

function handleEmulatorAction(action, id) {
  const emulators = getEmulators();
  const emu = emulators.find((e) => e.id === id);

  if (!emu) return;

  if (action === "remove") {
    emu.exePath = "";
    emu.folderPath = "";
    saveEmulators(emulators);
    renderAll();
    return;
  }

  if (action === "config") {
    showToast("Configurar .exe fica ligado no Tauri/Rust.");
  }
}

function addCustomEmulator() {
  const name = prompt("Nome do emulador:");
  if (!name) return;

  const systems = prompt("Sistemas separados por vírgula:") || "Manual";
  const emulators = getEmulators();

  emulators.push({
    id: createId(name),
    name,
    version: "Manual",
    systems: systems.split(",").map((s) => s.trim()),
    exePath: "",
    folderPath: "",
  });

  saveEmulators(emulators);
  renderAll();
}

function resetEmulators() {
  saveEmulators(defaultEmulators);
  renderAll();
}

function seedStorage() {
  if (!localStorage.getItem(STORAGE_LIBRARY)) saveLibrary([]);
  if (!localStorage.getItem(STORAGE_EMULATORS)) saveEmulators(defaultEmulators);
}

function getLibrary() {
  return readJson(STORAGE_LIBRARY, []).map(normalizeGame);
}

function saveLibrary(value) {
  localStorage.setItem(STORAGE_LIBRARY, JSON.stringify(value.map(normalizeGame), null, 2));
}

function getEmulators() {
  const saved = readJson(STORAGE_EMULATORS, []);
  const merged = [...defaultEmulators];

  saved.forEach((item) => {
    const index = merged.findIndex((e) => e.id === item.id);
    if (index >= 0) merged[index] = { ...merged[index], ...item };
    else merged.push(item);
  });

  return merged;
}

function saveEmulators(value) {
  localStorage.setItem(STORAGE_EMULATORS, JSON.stringify(value, null, 2));
}

function normalizeGame(game) {
  return {
    id: game.id || createId(game.title || "game"),
    title: game.title || "Jogo sem nome",
    fileName: game.fileName || "",
    romPath: game.romPath || "",
    extension: game.extension || "",
    system: game.system || "ROM",
    emulatorId: game.emulatorId || "manual",
    emulator: game.emulator || "Manual",
    coverPath: game.coverPath || "",
    lastPlayed: game.lastPlayed || "Novo",
    playTime: game.playTime || "0h 0m",
    favorite: Boolean(game.favorite),
  };
}

function countByTitle(library, terms) {
  return library.filter((game) => {
    const title = game.title.toLowerCase();
    return terms.some((term) => title.includes(term));
  }).length;
}

function setImage(id, src) {
  const img = $(id);
  if (!img) return;
  img.src = assetUrl(src);
}

function createCoverInput() {
  const input = document.createElement("input");
  input.id = "coverInput";
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp";
  input.hidden = true;
  document.body.appendChild(input);
  return input;
}

function isTauriReady() {
  return Boolean(window.__TAURI__?.core?.invoke);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getExtension(fileName) {
  return String(fileName).split(".").pop().toLowerCase();
}

function getFileName(path) {
  return String(path).replaceAll("\\", "/").split("/").pop();
}

function cleanTitle(fileName) {
  return String(fileName)
    .replace(/\.[^/.]+$/, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createId(text) {
  return `${String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42)}-${Date.now()}`;
}

function shortSystem(system) {
  const map = {
    "Nintendo 3DS": "3DS",
    "Nintendo DS": "DS",
    "GameCube": "GC",
  };

  return map[system] || system;
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}