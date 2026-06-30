import { RATU_ASSETS, getGameCover, getEmulatorImage, getDisplayImage } from "./data/ratu-assets.js";

const $ = (id) => document.getElementById(id);

const splash = $("splash");
const app = $("app");
const pageTitle = $("pageTitle");
const pageSubtitle = $("pageSubtitle");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

const recentGamesGrid = $("recentGamesGrid");
const homeFeatureGrid = $("homeFeatureGrid");
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
const coverInput = $("coverInput");

const addEmulatorButton = $("addEmulatorButton");
const resetDefaultEmulatorsButton = $("resetDefaultEmulatorsButton");
const toast = $("toast");

const STORAGE_LIBRARY = "ratu_library_assets_v1";
const STORAGE_EMULATORS = "ratu_emulators_assets_v1";

let currentPage = "home";
let currentSearch = "";
let onlyRecent = false;
let selectedGameId = "";
let pendingCoverGameId = "";

const pageInfo = {
  home: {
    title: "Início",
    subtitle: "Seu painel rápido do Ratu Launcher.",
  },
  saves: {
    title: "Saves",
    subtitle: "Gerencie, organize e sincronize seus saves.",
  },
  "new-rom": {
    title: "Nova ROM",
    subtitle: "Adicione uma ROM e deixe o Ratu criar o card.",
  },
  about: {
    title: "Sobre",
    subtitle: "Mais informações sobre o Ratu Launcher.",
  },
  emulators: {
    title: "Emuladores",
    subtitle: "Gerencie seus emuladores. Instale apenas os que você quer usar.",
  },
};

const systemByExtension = {
  nes: { system: "NES", emulatorId: "nestopia", emulator: "FCEUX" },
  smc: { system: "SNES", emulatorId: "snes9x", emulator: "Mesen-S" },
  sfc: { system: "SNES", emulatorId: "snes9x", emulator: "Mesen-S" },

  gb: { system: "GB", emulatorId: "mgba", emulator: "mGBA" },
  gbc: { system: "GBC", emulatorId: "mgba", emulator: "mGBA" },
  gba: { system: "GBA", emulatorId: "mgba", emulator: "mGBA" },

  nds: { system: "DS", emulatorId: "melonds", emulator: "melonDS" },
  dsi: { system: "DS", emulatorId: "melonds", emulator: "melonDS" },

  n64: { system: "N64", emulatorId: "mupen64plus", emulator: "Mupen64Plus" },
  z64: { system: "N64", emulatorId: "mupen64plus", emulator: "Mupen64Plus" },
  v64: { system: "N64", emulatorId: "mupen64plus", emulator: "Mupen64Plus" },

  "3ds": { system: "3DS", emulatorId: "azahar", emulator: "Azahar" },
  cci: { system: "3DS", emulatorId: "azahar", emulator: "Azahar" },
  cxi: { system: "3DS", emulatorId: "azahar", emulator: "Azahar" },
  cia: { system: "3DS", emulatorId: "azahar", emulator: "Azahar" },

  cue: { system: "PS1", emulatorId: "duckstation", emulator: "DuckStation" },
  bin: { system: "PS1", emulatorId: "duckstation", emulator: "DuckStation" },

  iso: { system: "PSP/PS1/Wii", emulatorId: "ppsspp", emulator: "PPSSPP" },
  cso: { system: "PSP", emulatorId: "ppsspp", emulator: "PPSSPP" },

  gcm: { system: "GameCube", emulatorId: "dolphin", emulator: "Dolphin" },
  wbfs: { system: "Wii", emulatorId: "dolphin", emulator: "Dolphin" },
};

const defaultEmulators = [
  {
    id: "mgba",
    name: "mGBA",
    version: "0.10.3",
    systems: ["GBA", "GB", "GBC"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://mgba.io/downloads.html",
    wingetId: "JeffreyPfau.mGBA",
  },
  {
    id: "melonds",
    name: "melonDS",
    version: "0.9.5",
    systems: ["DS"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://melonds.kuribo64.net/downloads.php",
    wingetId: "melonDS.melonDS",
  },
  {
    id: "mupen64plus",
    name: "Mupen64Plus",
    version: "2.5.9",
    systems: ["N64"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://mupen64plus.org/",
    wingetId: "Mupen64.Mupen64",
  },
  {
    id: "azahar",
    name: "Azahar",
    version: "2123",
    systems: ["3DS"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://azahar-emu.org/pages/download/",
    wingetId: "AzaharEmu.Azahar",
  },
  {
    id: "snes9x",
    name: "Snes9x",
    version: "1.63",
    systems: ["SNES"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://www.snes9x.com/",
    wingetId: "Snes9x.Snes9x",
  },
  {
    id: "dolphin",
    name: "Dolphin",
    version: "5.0",
    systems: ["GameCube", "Wii"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://dolphin-emu.org/download/",
    wingetId: "DolphinEmulator.Dolphin",
  },
  {
    id: "ppsspp",
    name: "PPSSPP",
    version: "1.17.1",
    systems: ["PSP"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://www.ppsspp.org/download/",
    wingetId: "PPSSPPTeam.PPSSPP",
  },
  {
    id: "duckstation",
    name: "DuckStation",
    version: "0.1",
    systems: ["PS1"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://duckstation.org/",
    wingetId: "Stenzek.DuckStation",
  },
  {
    id: "nestopia",
    name: "FCEUX",
    version: "2.6",
    systems: ["NES"],
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://fceux.com/web/home.html",
    wingetId: "FCEUX.FCEUX",
  },
];

startApp();

async function startApp() {
  applyStaticImages();
  seedStorage();
  setupEvents();
  await loadTauriData();

  setTimeout(() => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
    setPage("home");
  }, 400);
}

function applyStaticImages() {
  setImage("splashRat", RATU_ASSETS.geral.logoRat);
  setImage("brandRat", RATU_ASSETS.geral.logoRat);
  setImage("playerRat", RATU_ASSETS.geral.ratLeft);
  setImage("homeSleepingRat", RATU_ASSETS.geral.sleepingRat);
  setImage("uploadRat", RATU_ASSETS.geral.ratRight);
  setImage("emulatorInfoRat", RATU_ASSETS.geral.ratRight);
  setImage("tipRat", RATU_ASSETS.geral.ratLeft);
  setImage("aboutRat", RATU_ASSETS.geral.logoRat);
  setImage("aboutSleepingRat", RATU_ASSETS.geral.sleepingRat);
}

function setupEvents() {
  navItems.forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  viewAllSavesButton.addEventListener("click", () => setPage("saves"));
  homeEmulatorsButton.addEventListener("click", () => setPage("emulators"));
  savesAddRomButton.addEventListener("click", () => setPage("new-rom"));
  emptyAddButton.addEventListener("click", () => setPage("new-rom"));

  uploadBox.addEventListener("click", selectRom);
  uploadBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") selectRom();
  });

  romInput.addEventListener("change", () => {
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

  saveSearchInput.addEventListener("input", () => {
    currentSearch = saveSearchInput.value.trim().toLowerCase();
    renderSavesPage();
  });

  filterRecentButton.addEventListener("click", () => {
    onlyRecent = !onlyRecent;
    filterRecentButton.textContent = onlyRecent ? "Todos" : "Filtros";
    renderSavesPage();
  });

  sortSelect.addEventListener("change", renderSavesPage);

  addEmulatorButton.addEventListener("click", addCustomEmulator);
  resetDefaultEmulatorsButton.addEventListener("click", resetEmulators);
}

function setPage(pageName) {
  const info = pageInfo[pageName];
  if (!info) return;

  currentPage = pageName;
  pageTitle.textContent = info.title;
  pageSubtitle.textContent = info.subtitle;

  navItems.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  pages.forEach((page) => {
    page.classList.toggle("active", page.id === `page-${pageName}`);
  });

  renderAll();
}

function renderAll() {
  renderHome();
  renderSavesPage();
  renderEmulators();
}

function renderHome() {
  renderHomeFeatureCards();
  renderRecentGames();
  renderHomeEmulators();
}

function renderHomeFeatureCards() {
  const cards = [
    {
      title: "Saves",
      desc: "Gerencie e organize seus arquivos de jogo.",
      action: "Abrir",
      page: "saves",
      img: RATU_ASSETS.home.cardSaves,
    },
    {
      title: "Nova ROM",
      desc: "Adicione uma nova ROM e comece a jogar.",
      action: "Adicionar ROM",
      page: "new-rom",
      img: RATU_ASSETS.home.cardNovaRom,
    },
    {
      title: "Sobre",
      desc: "Saiba mais sobre o Ratu Launcher.",
      action: "Abrir",
      page: "about",
      img: RATU_ASSETS.home.cardSobre,
    },
  ];

  homeFeatureGrid.innerHTML = cards.map((card) => `
    <button class="home-feature-card" data-page-go="${card.page}">
      <img class="card-bg-img" src="${escapeAttr(card.img)}" alt="" />
      <div class="card-content">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.desc)}</p>
      </div>
      <span class="mini-action">${escapeHtml(card.action)} <b>→</b></span>
    </button>
  `).join("");

  homeFeatureGrid.querySelectorAll("[data-page-go]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.pageGo));
  });
}

function renderRecentGames() {
  const library = getLibrary().slice(0, 6);

  if (library.length === 0) {
    recentGamesGrid.innerHTML = `
      <article class="empty-state">
        <h3>Nenhum jogo ainda</h3>
        <p>Adicione uma ROM para ela aparecer aqui.</p>
      </article>
    `;
    return;
  }

  recentGamesGrid.innerHTML = library.map((game) => createGameCardHtml(game)).join("");

  recentGamesGrid.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleGameAction(button.dataset.action, button.dataset.id));
  });
}

function createGameCardHtml(rawGame) {
  const game = normalizeGame(rawGame);
  const cover = getGameCover(game);
  const emulatorImg = getEmulatorImage(game.emulatorId);

  return `
    <article class="game-card" data-id="${escapeAttr(game.id)}">
      <img class="card-bg-img" src="${escapeAttr(RATU_ASSETS.home.gameCard)}" alt="" />

      <div class="game-cover-box">
        <img class="cover-img" src="${escapeAttr(cover)}" alt="${escapeAttr(game.title)}" />
        <span class="emulator-badge">
          <img src="${escapeAttr(emulatorImg)}" alt="" />
          ${escapeHtml(game.system)}
        </span>
      </div>

      <h4>${escapeHtml(game.title)}</h4>
      <small>${escapeHtml(game.system)}</small>

      <button class="dots" data-action="details" data-id="${escapeAttr(game.id)}">⋮</button>
    </article>
  `;
}

function renderHomeEmulators() {
  const emulators = getEmulators().slice(0, 4);

  homeEmulatorsGrid.innerHTML = emulators.map((emulator) => {
    const isInstalled = Boolean(emulator.exePath);
    const image = getEmulatorImage(emulator.id);

    return `
      <article class="home-emulator-card">
        <img src="${escapeAttr(image)}" alt="${escapeAttr(emulator.name)}" />
        <div>
          <h4>${escapeHtml(emulator.name)}</h4>
          <p>Versão ${escapeHtml(emulator.version || "?")}</p>
          <span class="status ${isInstalled ? "" : "off"}">${isInstalled ? "Atualizado" : "Não instalado"}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderSavesPage() {
  renderFolders();

  let library = getLibrary();

  if (currentSearch) {
    library = library.filter((game) => {
      const text = `${game.title} ${game.system} ${game.emulator}`.toLowerCase();
      return text.includes(currentSearch);
    });
  }

  if (onlyRecent) {
    library = library.filter((game) => ["Agora", "Hoje", "Novo"].includes(game.lastPlayed));
  }

  if (sortSelect.value === "name") {
    library.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortSelect.value === "system") {
    library.sort((a, b) => a.system.localeCompare(b.system));
  }

  if (library.length === 0) {
    savesList.innerHTML = "";
    emptySaves.classList.remove("hidden");
    renderDetailPanel(null);
    return;
  }

  emptySaves.classList.add("hidden");

  if (!selectedGameId || !library.some((game) => game.id === selectedGameId)) {
    selectedGameId = library[0].id;
  }

  savesList.innerHTML = library.map((game) => createSaveRowHtml(game)).join("");

  savesList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleGameAction(button.dataset.action, button.dataset.id));
  });

  renderDetailPanel(getLibrary().find((game) => game.id === selectedGameId));
}

function renderFolders() {
  const library = getLibrary();

  const folders = [
    { name: "Pokémon", count: countByText(library, "pokemon pokémon") },
    { name: "Mario", count: countByText(library, "mario") },
    { name: "Zelda", count: countByText(library, "zelda") },
    { name: "Favoritos", count: library.filter((game) => game.favorite).length },
  ];

  foldersGrid.innerHTML = folders.map((folder) => `
    <article class="folder-card">
      <img class="card-bg-img" src="${escapeAttr(RATU_ASSETS.saves.folderCard)}" alt="" />
      <h4>${escapeHtml(folder.name)}</h4>
      <small>${folder.count} saves</small>
    </article>
  `).join("");
}

function createSaveRowHtml(rawGame) {
  const game = normalizeGame(rawGame);
  const cover = getGameCover(game);
  const selected = game.id === selectedGameId ? "selected" : "";

  return `
    <article class="save-row ${selected}" data-id="${escapeAttr(game.id)}">
      <div class="save-row-cover">
        <img src="${escapeAttr(cover)}" alt="${escapeAttr(game.title)}" />
      </div>

      <div class="save-row-info">
        <span class="pill">${escapeHtml(game.system)}</span>
        <h4>${escapeHtml(game.title)} ${game.favorite ? "♥" : ""}</h4>
        <p>Última jogada: ${escapeHtml(game.lastPlayed)}<br />Tempo de jogo: ${escapeHtml(game.playTime)}</p>
      </div>

      <button class="play-button" data-action="play" data-id="${escapeAttr(game.id)}">▶ Jogar</button>
      <button class="row-button" data-action="cover" data-id="${escapeAttr(game.id)}">✎ Capa</button>
      <button class="row-button" data-action="details" data-id="${escapeAttr(game.id)}">⋮</button>
    </article>
  `;
}

function renderDetailPanel(rawGame) {
  if (!rawGame) {
    saveDetailPanel.innerHTML = `
      <h3>Nenhum save</h3>
      <p class="muted">Adicione uma ROM primeiro.</p>
    `;
    return;
  }

  const game = normalizeGame(rawGame);
  const cover = getGameCover(game);

  saveDetailPanel.innerHTML = `
    <div class="detail-cover">
      <img src="${escapeAttr(cover)}" alt="${escapeAttr(game.title)}" />
    </div>

    <h3>${escapeHtml(game.title)} ${game.favorite ? "♥" : ""}</h3>
    <span class="pill">${escapeHtml(game.system)}</span>

    <div class="detail-meta">
      <div>📅 Última jogada<br /><strong>${escapeHtml(game.lastPlayed)}</strong></div>
      <div>⏱ Tempo de jogo<br /><strong>${escapeHtml(game.playTime)}</strong></div>
      <div>📁 Local da ROM<br /><strong>${escapeHtml(game.romPath || "sem caminho real")}</strong></div>
      <div>🔁 Sincronização<br /><strong>${game.synced ? "Sincronizado" : "Local"}</strong></div>
    </div>

    <h4>Slots de save</h4>

    <div class="slot-list">
      ${game.saveSlots.map((slot) => `
        <button class="slot-button ${slot.id === game.activeSlot ? "active" : ""}" data-action="slot" data-id="${escapeAttr(game.id)}" data-slot="${escapeAttr(slot.id)}">
          <strong>${escapeHtml(slot.label)} ${slot.id === game.activeSlot ? "ATIVO" : ""}</strong><br />
          <span>${escapeHtml(slot.place)}</span><br />
          <small>${escapeHtml(slot.time)} · Lv. ${escapeHtml(slot.level)}</small>
        </button>
      `).join("")}
    </div>

    <div class="detail-actions">
      <button class="primary-button" data-action="play" data-id="${escapeAttr(game.id)}">Jogar</button>
      <button class="outline-button" data-action="cover" data-id="${escapeAttr(game.id)}">Trocar capa personalizada</button>
      <button class="danger-button" data-action="delete" data-id="${escapeAttr(game.id)}">Apagar da biblioteca</button>
    </div>
  `;

  saveDetailPanel.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "slot") {
        changeSlot(button.dataset.id, button.dataset.slot);
        return;
      }

      handleGameAction(button.dataset.action, button.dataset.id);
    });
  });
}

function renderEmulators() {
  const emulators = getEmulators();

  emulatorList.innerHTML = emulators.map((emulator) => {
    const image = getEmulatorImage(emulator.id);
    const installed = Boolean(emulator.exePath);

    return `
      <article class="emulator-card">
        <img src="${escapeAttr(image)}" alt="${escapeAttr(emulator.name)}" />

        <h4>${escapeHtml(emulator.name)}</h4>
        <p>Versão ${escapeHtml(emulator.version || "?")}</p>
        <span class="status ${installed ? "" : "off"}">${installed ? "Instalado" : "Não instalado"}</span>

        <div class="emulator-card-actions">
          <button class="${installed ? "danger-button" : "primary-button"}" data-action="${installed ? "uninstall" : "install"}" data-id="${escapeAttr(emulator.id)}">
            ${installed ? "Desinstalar" : "Instalar"}
          </button>

          <button class="row-button" data-action="config" data-id="${escapeAttr(emulator.id)}">
            Configurar
          </button>
        </div>
      </article>
    `;
  }).join("");

  emulatorList.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleEmulatorAction(button.dataset.action, button.dataset.id));
  });
}

async function handleGameAction(action, gameId) {
  const library = getLibrary();
  const game = library.find((item) => item.id === gameId);

  if (!game) {
    showToast("Jogo não encontrado.");
    return;
  }

  selectedGameId = game.id;

  if (action === "details") {
    setPage("saves");
    renderAll();
    return;
  }

  if (action === "play") {
    await playGame(game);
    return;
  }

  if (action === "cover") {
    await chooseCover(game.id);
    return;
  }

  if (action === "delete") {
    deleteGame(game.id);
  }
}

async function playGame(game) {
  const library = getLibrary();
  const index = library.findIndex((item) => item.id === game.id);

  if (index < 0) return;

  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === game.emulatorId);

  if (!isTauriReady()) {
    showToast("Para abrir jogo real, rode pelo app Tauri.");
    return;
  }

  if (!game.romPath) {
    showToast("Esse jogo foi adicionado pelo navegador. Adicione pelo app Tauri para abrir.");
    return;
  }

  if (!emulator || !emulator.exePath) {
    showToast(`Configure o emulador ${game.emulator} primeiro.`);
    setPage("emulators");
    return;
  }

  library[index].lastPlayed = "Agora";
  library[index].updatedAt = new Date().toISOString();

  saveLibrary(library);
  await persistLibrary(library);

  renderAll();

  try {
    const result = await invokeRust("launch_game", {
      emulatorPath: emulator.exePath,
      romPath: game.romPath,
    });

    showToast(result);
  } catch (error) {
    alert("Erro ao abrir jogo.\n\n" + String(error));
  }
}

async function chooseCover(gameId) {
  pendingCoverGameId = gameId;

  if (!isTauriReady()) {
    coverInput.click();
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");

    const selected = await open({
      multiple: false,
      directory: false,
      title: "Escolha a capa do jogo",
      filters: [
        {
          name: "Imagens",
          extensions: ["png", "jpg", "jpeg", "webp"],
        },
      ],
    });

    if (!selected || Array.isArray(selected)) return;

    setGameCover(gameId, selected);
  } catch (error) {
    console.error(error);
    coverInput.click();
  }
}

function setGameCover(gameId, coverPath) {
  const library = getLibrary();
  const game = library.find((item) => item.id === gameId);

  if (!game) return;

  game.coverPath = coverPath;
  game.updatedAt = new Date().toISOString();

  saveLibrary(library);
  persistLibrary(library);

  renderAll();
  showToast("Capa personalizada aplicada.");
}

function changeSlot(gameId, slotId) {
  const library = getLibrary();
  const game = library.find((item) => item.id === gameId);

  if (!game) return;

  game.activeSlot = slotId;
  game.updatedAt = new Date().toISOString();

  saveLibrary(library);
  persistLibrary(library);

  renderAll();
}

function deleteGame(gameId) {
  const library = getLibrary();
  const game = library.find((item) => item.id === gameId);

  if (!game) return;

  const confirmDelete = confirm(`Apagar ${game.title} da biblioteca?`);

  if (!confirmDelete) return;

  const updated = library.filter((item) => item.id !== gameId);

  selectedGameId = updated[0]?.id || "";

  saveLibrary(updated);
  persistLibrary(updated);

  renderAll();
  showToast("Jogo removido.");
}

async function selectRom() {
  if (!isTauriReady()) {
    romInput.click();
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
          extensions: [
            "nes",
            "smc",
            "sfc",
            "gb",
            "gbc",
            "gba",
            "nds",
            "dsi",
            "n64",
            "z64",
            "v64",
            "3ds",
            "cci",
            "cxi",
            "cia",
            "cue",
            "bin",
            "iso",
            "cso",
            "gcm",
            "wbfs",
          ],
        },
        {
          name: "Todos",
          extensions: ["*"],
        },
      ],
    });

    if (!selected || Array.isArray(selected)) return;

    await addRomFromPath(selected);
  } catch (error) {
    console.error(error);
    romInput.click();
  }
}

async function addRomFromPath(romPath) {
  const fileName = getFileName(romPath);
  const extension = getExtension(fileName);
  const detected = systemByExtension[extension] || {
    system: "ROM",
    emulatorId: "manual",
    emulator: "Manual",
  };

  const title = cleanTitle(fileName);
  const id = createId(title);

  let gameFolderPath = "";

  if (isTauriReady()) {
    try {
      gameFolderPath = await invokeRust("create_game_folder", { gameId: id });
    } catch (error) {
      console.error(error);
    }
  }

  const newGame = normalizeGame({
    id,
    title,
    fileName,
    romPath,
    extension,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    coverPath: "",
    gameFolderPath,
    favorite: false,
    synced: true,
    lastPlayed: "Novo",
    playTime: "0h 0m",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const library = getLibrary();

  library.unshift(newGame);
  selectedGameId = newGame.id;

  saveLibrary(library);
  await persistLibrary(library);

  setPage("saves");
  showToast(`Adicionado: ${title}`);
}

function addRomFromBrowserFile(file) {
  const extension = getExtension(file.name);
  const detected = systemByExtension[extension] || {
    system: "ROM",
    emulatorId: "manual",
    emulator: "Manual",
  };

  const title = cleanTitle(file.name);

  const newGame = normalizeGame({
    id: createId(title),
    title,
    fileName: file.name,
    romPath: "",
    extension,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    coverPath: "",
    favorite: false,
    synced: false,
    lastPlayed: "Novo",
    playTime: "0h 0m",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const library = getLibrary();

  library.unshift(newGame);
  selectedGameId = newGame.id;

  saveLibrary(library);
  persistLibrary(library);

  setPage("saves");
  showToast(`Adicionado: ${title}`);
}

async function handleEmulatorAction(action, emulatorId) {
  if (action === "install") {
    await installEmulator(emulatorId);
    return;
  }

  if (action === "config") {
    await configureEmulator(emulatorId);
    return;
  }

  if (action === "uninstall") {
    await uninstallEmulator(emulatorId);
  }
}

async function installEmulator(emulatorId) {
  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === emulatorId);

  if (!emulator) return;

  if (!isTauriReady()) {
    showToast("Instalação automática só funciona no app Tauri.");
    return;
  }

  const confirmInstall = confirm(`Instalar ${emulator.name} pelo winget?`);

  if (!confirmInstall) return;

  try {
    await invokeRust("install_emulator_winget", {
      wingetId: emulator.wingetId,
    });

    const exePath = await invokeRust("detect_emulator_exe", {
      emulatorId: emulator.id,
    });

    emulator.exePath = exePath;
    emulator.folderPath = getFolderFromPath(exePath);
    emulator.status = "Pronto";

    saveEmulators(emulators);
    await persistEmulators(emulators);

    renderAll();
    showToast(`${emulator.name} instalado.`);
  } catch (error) {
    console.error(error);
    const openSite = confirm("Não consegui instalar automático. Abrir site oficial?");

    if (openSite && emulator.installUrl) {
      await invokeRust("open_url", { url: emulator.installUrl });
    }
  }
}

async function configureEmulator(emulatorId) {
  if (!isTauriReady()) {
    showToast("Configuração de .exe só funciona no app Tauri.");
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");

    const selected = await open({
      multiple: false,
      directory: false,
      title: "Escolha o .exe do emulador",
      filters: [
        {
          name: "Executável",
          extensions: ["exe"],
        },
      ],
    });

    if (!selected || Array.isArray(selected)) return;

    const emulators = getEmulators();
    const emulator = emulators.find((item) => item.id === emulatorId);

    if (!emulator) return;

    emulator.exePath = selected;
    emulator.folderPath = getFolderFromPath(selected);
    emulator.status = "Pronto";

    saveEmulators(emulators);
    await persistEmulators(emulators);

    renderAll();
    showToast(`${emulator.name} configurado.`);
  } catch (error) {
    alert("Erro ao configurar emulador.\n\n" + String(error));
  }
}

async function uninstallEmulator(emulatorId) {
  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === emulatorId);

  if (!emulator) return;

  const confirmUninstall = confirm(`Desvincular ${emulator.name}?`);

  if (!confirmUninstall) return;

  emulator.exePath = "";
  emulator.folderPath = "";
  emulator.status = "Pendente";

  saveEmulators(emulators);
  await persistEmulators(emulators);

  renderAll();
  showToast(`${emulator.name} desvinculado.`);
}

function addCustomEmulator() {
  const name = prompt("Nome do emulador:");
  if (!name) return;

  const systemsText = prompt("Sistemas separados por vírgula. Exemplo: PS2, PSP, Wii");
  if (!systemsText) return;

  const emulators = getEmulators();

  emulators.push({
    id: createId(name),
    name,
    version: "Manual",
    systems: systemsText.split(",").map((item) => item.trim()).filter(Boolean),
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "",
    wingetId: "",
  });

  saveEmulators(emulators);
  persistEmulators(emulators);

  renderAll();
}

function resetEmulators() {
  const confirmReset = confirm("Redefinir emuladores padrões?");

  if (!confirmReset) return;

  saveEmulators(clone(defaultEmulators));
  persistEmulators(getEmulators());

  renderAll();
  showToast("Emuladores padrões redefinidos.");
}

async function loadTauriData() {
  if (!isTauriReady()) return;

  try {
    await invokeRust("ensure_ratu_data_folder");

    const libraryJson = await invokeRust("load_library_file");
    const emulatorsJson = await invokeRust("load_emulators_file");

    saveLibrary(normalizeLibrary(safeJson(libraryJson, getLibrary())));
    saveEmulators(mergeEmulators(safeJson(emulatorsJson, getEmulators())));
  } catch (error) {
    console.error(error);
    showToast("Abri em modo local.");
  }
}

function seedStorage() {
  if (!localStorage.getItem(STORAGE_LIBRARY)) {
    saveLibrary([]);
  }

  if (!localStorage.getItem(STORAGE_EMULATORS)) {
    saveEmulators(clone(defaultEmulators));
  }
}

function getLibrary() {
  return normalizeLibrary(readJson(STORAGE_LIBRARY, []));
}

function saveLibrary(library) {
  localStorage.setItem(STORAGE_LIBRARY, JSON.stringify(normalizeLibrary(library), null, 2));
}

async function persistLibrary(library) {
  if (!isTauriReady()) return;

  try {
    await invokeRust("save_library_file", {
      json: JSON.stringify(normalizeLibrary(library), null, 2),
    });
  } catch (error) {
    console.error(error);
  }
}

function getEmulators() {
  return mergeEmulators(readJson(STORAGE_EMULATORS, []));
}

function saveEmulators(emulators) {
  localStorage.setItem(STORAGE_EMULATORS, JSON.stringify(mergeEmulators(emulators), null, 2));
}

async function persistEmulators(emulators) {
  if (!isTauriReady()) return;

  try {
    await invokeRust("save_emulators_file", {
      json: JSON.stringify(mergeEmulators(emulators), null, 2),
    });
  } catch (error) {
    console.error(error);
  }
}

function normalizeLibrary(library) {
  if (!Array.isArray(library)) return [];

  return library.map(normalizeGame);
}

function normalizeGame(game) {
  const saveSlots = Array.isArray(game.saveSlots) && game.saveSlots.length
    ? game.saveSlots
    : createSlots();

  return {
    id: game.id || createId(game.title || "game"),
    title: game.title || "Jogo sem nome",
    fileName: game.fileName || "",
    romPath: game.romPath || "",
    extension: game.extension || getExtension(game.fileName || ""),
    system: game.system || "ROM",
    emulatorId: game.emulatorId || "manual",
    emulator: game.emulator || "Manual",
    coverPath: game.coverPath || "",
    gameFolderPath: game.gameFolderPath || "",
    favorite: Boolean(game.favorite),
    synced: game.synced !== false,
    lastPlayed: game.lastPlayed || "Novo",
    playTime: game.playTime || "0h 0m",
    activeSlot: game.activeSlot || "slot-1",
    saveSlots: saveSlots.map((slot, index) => ({
      id: slot.id || `slot-${index + 1}`,
      label: slot.label || `Slot ${index + 1}`,
      place: slot.place || (index === 0 ? "Sem dados" : "Vazio"),
      time: slot.time || "--:--",
      level: slot.level || "-",
    })),
    createdAt: game.createdAt || new Date().toISOString(),
    updatedAt: game.updatedAt || new Date().toISOString(),
  };
}

function createSlots() {
  return [
    {
      id: "slot-1",
      label: "Slot 1",
      place: "Save principal",
      time: "00:00",
      level: "1",
    },
    {
      id: "slot-2",
      label: "Slot 2",
      place: "Sem dados",
      time: "--:--",
      level: "-",
    },
    {
      id: "slot-3",
      label: "Slot 3",
      place: "Sem dados",
      time: "--:--",
      level: "-",
    },
  ];
}

function mergeEmulators(saved) {
  const list = Array.isArray(saved) ? saved : [];
  const merged = clone(defaultEmulators);

  for (const savedEmulator of list) {
    const index = merged.findIndex((item) => item.id === savedEmulator.id);

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        ...savedEmulator,
        systems: savedEmulator.systems?.length ? savedEmulator.systems : merged[index].systems,
      };
    } else {
      merged.push(savedEmulator);
    }
  }

  return merged;
}

function countByText(library, words) {
  const terms = words.toLowerCase().split(" ");

  return library.filter((game) => {
    const title = game.title.toLowerCase();
    return terms.some((term) => title.includes(term));
  }).length;
}

function isTauriReady() {
  return Boolean(window.__TAURI__?.core?.invoke);
}

async function invokeRust(command, args = {}) {
  const invoke = window.__TAURI__?.core?.invoke;

  if (!invoke) {
    throw new Error("Tauri não disponível.");
  }

  return await invoke(command, args);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeJson(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setImage(id, src) {
  const img = $(id);
  if (!img) return;

  img.src = getDisplayImage(src);
}

function getExtension(fileName) {
  const parts = String(fileName).split(".");
  return parts.length > 1 ? parts.pop().toLowerCase().trim() : "";
}

function getFileName(path) {
  return String(path).replaceAll("\\", "/").split("/").pop();
}

function getFolderFromPath(path) {
  const normalized = String(path).replaceAll("\\", "/");
  const parts = normalized.split("/");

  parts.pop();

  return parts.join("/");
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
  const slug = String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 44);

  return `${slug || "item"}-${Date.now()}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
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