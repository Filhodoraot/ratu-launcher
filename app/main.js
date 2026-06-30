import { RATU_ASSETS, getGameCover, getEmulatorImage } from "./data/ratu-assets.js";

const splash = document.getElementById("splash");
const app = document.getElementById("app");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const menuButtons = document.querySelectorAll(".menu-button");
const pages = document.querySelectorAll(".page");

const recentSavesGrid = document.getElementById("recentSavesGrid");
const savesGrid = document.getElementById("savesGrid");
const emptySaves = document.getElementById("emptySaves");
const homeFeatureGrid = document.getElementById("homeFeatureGrid");
const homeEmulatorsGrid = document.getElementById("homeEmulatorsGrid");

const homeSaveCount = document.getElementById("homeSaveCount");
const homeEmulatorCount = document.getElementById("homeEmulatorCount");
const homeInstalledCount = document.getElementById("homeInstalledCount");

const quickAddButton = document.getElementById("quickAddButton");
const homeAddRomButton = document.getElementById("homeAddRomButton");
const homeContinueButton = document.getElementById("homeContinueButton");
const homeEmulatorsButton = document.getElementById("homeEmulatorsButton");
const viewAllSavesButton = document.getElementById("viewAllSavesButton");
const savesAddRomButton = document.getElementById("savesAddRomButton");
const emptyAddButton = document.getElementById("emptyAddButton");

const uploadBox = document.getElementById("uploadBox");
const romInput = document.getElementById("romInput");
const saveSearchInput = document.getElementById("saveSearchInput");
const filterRecentButton = document.getElementById("filterRecentButton");
const clearSearchButton = document.getElementById("clearSearchButton");

const emulatorList = document.getElementById("emulatorList");
const addEmulatorButton = document.getElementById("addEmulatorButton");
const resetDefaultEmulatorsButton = document.getElementById("resetDefaultEmulatorsButton");
const toast = document.getElementById("toast");

const STORAGE_LIBRARY = "ratu_library_v5";
const STORAGE_EMULATORS = "ratu_emulators_v5";
const OLD_STORAGE_LIBRARY = "ratu_library_v4";
const OLD_STORAGE_EMULATORS = "ratu_emulators_v4";

let currentSaveFilter = "all";
let currentSearch = "";

const pageInfo = {
  home: {
    title: "Home",
    subtitle: "Seu painel rápido do Ratu Launcher."
  },
  saves: {
    title: "Saves",
    subtitle: "Todos os seus jogos e três slots de save por ROM."
  },
  "new-rom": {
    title: "Nova ROM",
    subtitle: "Adicione uma ROM e o Ratu cria o card na biblioteca."
  },
  emulators: {
    title: "Emuladores",
    subtitle: "Instale, configure ou remova os motores do launcher."
  },
  about: {
    title: "Sobre",
    subtitle: "Informações rápidas do Ratu Launcher."
  }
};

const systemByExtension = {
  nes: { system: "NES", emulatorId: "nestopia", emulator: "FCEUX" },
  smc: { system: "SNES", emulatorId: "snes9x", emulator: "Mesen-S" },
  sfc: { system: "SNES", emulatorId: "snes9x", emulator: "Mesen-S" },
  gb: { system: "Game Boy", emulatorId: "mgba", emulator: "mGBA" },
  gbc: { system: "Game Boy Color", emulatorId: "mgba", emulator: "mGBA" },
  gba: { system: "Game Boy Advance", emulatorId: "mgba", emulator: "mGBA" },
  nds: { system: "Nintendo DS", emulatorId: "melonds", emulator: "melonDS" },
  dsi: { system: "Nintendo DS", emulatorId: "melonds", emulator: "melonDS" },
  n64: { system: "Nintendo 64", emulatorId: "mupen64plus", emulator: "Mupen64" },
  z64: { system: "Nintendo 64", emulatorId: "mupen64plus", emulator: "Mupen64" },
  v64: { system: "Nintendo 64", emulatorId: "mupen64plus", emulator: "Mupen64" },
  cue: { system: "PlayStation", emulatorId: "duckstation", emulator: "DuckStation" },
  bin: { system: "PlayStation", emulatorId: "duckstation", emulator: "DuckStation" },
  iso: { system: "Disc Image", emulatorId: "duckstation", emulator: "DuckStation" },
  "3ds": { system: "Nintendo 3DS", emulatorId: "azahar", emulator: "Azahar" },
  cci: { system: "Nintendo 3DS", emulatorId: "azahar", emulator: "Azahar" },
  cxi: { system: "Nintendo 3DS", emulatorId: "azahar", emulator: "Azahar" },
  cia: { system: "Nintendo 3DS", emulatorId: "azahar", emulator: "Azahar" },
  psp: { system: "PSP", emulatorId: "ppsspp", emulator: "PPSSPP" },
  cso: { system: "PSP", emulatorId: "ppsspp", emulator: "PPSSPP" },
  gcm: { system: "GameCube", emulatorId: "dolphin", emulator: "Dolphin" },
  wbfs: { system: "Wii", emulatorId: "dolphin", emulator: "Dolphin" }
};

const defaultEmulators = [
  {
    id: "mgba",
    name: "mGBA",
    systems: ["Game Boy Advance", "Game Boy", "Game Boy Color"],
    version: "0.10.3",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://mgba.io/downloads.html",
    wingetId: "JeffreyPfau.mGBA"
  },
  {
    id: "melonds",
    name: "melonDS",
    systems: ["Nintendo DS"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://melonds.kuribo64.net/downloads.php",
    wingetId: "melonDS.melonDS"
  },
  {
    id: "azahar",
    name: "Azahar",
    systems: ["Nintendo 3DS"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://azahar-emu.org/pages/download/",
    wingetId: "AzaharEmu.Azahar"
  },
  {
    id: "mupen64plus",
    name: "Mupen64",
    systems: ["Nintendo 64"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://mupen64plus.org/",
    wingetId: "Mupen64.Mupen64"
  },
  {
    id: "duckstation",
    name: "DuckStation",
    systems: ["PlayStation"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://duckstation.org/",
    wingetId: "Stenzek.DuckStation"
  },
  {
    id: "snes9x",
    name: "Mesen-S",
    systems: ["SNES"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://github.com/SourMesen/Mesen-S",
    wingetId: "SourMesen.Mesen-S"
  },
  {
    id: "nestopia",
    name: "FCEUX",
    systems: ["NES"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://fceux.com/web/home.html",
    wingetId: "FCEUX.FCEUX"
  },
  {
    id: "ppsspp",
    name: "PPSSPP",
    systems: ["PSP"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://www.ppsspp.org/download/",
    wingetId: "PPSSPPTeam.PPSSPP"
  },
  {
    id: "dolphin",
    name: "Dolphin",
    systems: ["GameCube", "Wii"],
    version: "Atual",
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://dolphin-emu.org/download/",
    wingetId: "DolphinEmulator.Dolphin"
  }
];

startApp();

async function startApp() {
  await initializeData();
  setupEvents();

  setTimeout(() => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
    setPage("home");
    renderAll();
  }, 700);
}

async function initializeData() {
  seedStorage();

  if (!isTauriReady()) {
    return;
  }

  try {
    await invokeRust("ensure_ratu_data_folder");

    const libraryJson = await invokeRust("load_library_file");
    const emulatorsJson = await invokeRust("load_emulators_file");

    const library = normalizeLibrary(safeParseJson(libraryJson, getLibrary()));
    const emulatorsFromFile = safeParseJson(emulatorsJson, getEmulators());

    saveLibrary(library);
    saveEmulators(mergeDefaultEmulators(emulatorsFromFile));

    await persistLibrary(library);
    await persistEmulators(getEmulators());
  } catch (error) {
    console.error(error);
    showToast("Não consegui carregar os arquivos locais do Ratu.");
  }
}

function seedStorage() {
  if (!localStorage.getItem(STORAGE_LIBRARY)) {
    const oldLibrary = readJson(OLD_STORAGE_LIBRARY, []);
    saveLibrary(normalizeLibrary(Array.isArray(oldLibrary) ? oldLibrary : []));
  }

  if (!localStorage.getItem(STORAGE_EMULATORS)) {
    const oldEmulators = readJson(OLD_STORAGE_EMULATORS, []);
    saveEmulators(mergeDefaultEmulators(Array.isArray(oldEmulators) ? oldEmulators : []));
  }
}

function setupEvents() {
  menuButtons.forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });

  quickAddButton.addEventListener("click", () => setPage("new-rom"));
  homeAddRomButton.addEventListener("click", () => setPage("new-rom"));
  savesAddRomButton.addEventListener("click", () => setPage("new-rom"));
  emptyAddButton.addEventListener("click", () => setPage("new-rom"));
  viewAllSavesButton.addEventListener("click", () => setPage("saves"));
  homeEmulatorsButton.addEventListener("click", () => setPage("emulators"));
  homeContinueButton.addEventListener("click", () => continueLastSave());
  addEmulatorButton.addEventListener("click", () => addCustomEmulator());
  resetDefaultEmulatorsButton.addEventListener("click", () => resetAndRepairDefaultEmulators());

  uploadBox.addEventListener("click", () => selectRomWithDialog());
  uploadBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") selectRomWithDialog();
  });

  romInput.addEventListener("change", () => {
    const file = romInput.files[0];
    if (!file) return;
    addRomFromBrowserFile(file);
    romInput.value = "";
  });

  saveSearchInput.addEventListener("input", () => {
    currentSearch = saveSearchInput.value.trim().toLowerCase();
    renderSaves();
  });

  filterRecentButton.addEventListener("click", () => {
    currentSaveFilter = currentSaveFilter === "recent" ? "all" : "recent";
    filterRecentButton.textContent = currentSaveFilter === "recent" ? "Todos" : "Recentes";
    renderSaves();
  });

  clearSearchButton.addEventListener("click", () => {
    currentSearch = "";
    currentSaveFilter = "all";
    saveSearchInput.value = "";
    filterRecentButton.textContent = "Recentes";
    renderSaves();
  });
}

function setPage(pageName) {
  const info = pageInfo[pageName];
  if (!info) return;

  pageTitle.textContent = info.title;
  pageSubtitle.textContent = info.subtitle;

  menuButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  pages.forEach((page) => {
    page.classList.toggle("active", page.id === `page-${pageName}`);
  });

  renderAll();
}

function renderAll() {
  renderHome();
  renderSaves();
  renderEmulators();
}

function renderHome() {
  const library = getLibrary();
  const emulators = getEmulators();
  const installed = emulators.filter((item) => item.exePath).length;

  homeSaveCount.textContent = String(library.length);
  homeEmulatorCount.textContent = String(emulators.length);
  homeInstalledCount.textContent = String(installed);

  renderHomeFeatureCards();
  renderRecentSaves();
  renderHomeEmulators();
}

function renderHomeFeatureCards() {
  const cards = [
    {
      title: "Saves",
      desc: "Gerencie seus jogos e três slots por ROM.",
      button: "Abrir",
      page: "saves",
      bg: RATU_ASSETS.home.cardSaves
    },
    {
      title: "Nova ROM",
      desc: "Adicione um jogo novo na biblioteca.",
      button: "Adicionar",
      page: "new-rom",
      bg: RATU_ASSETS.home.cardNovaRom
    },
    {
      title: "Sobre",
      desc: "Veja como o Ratu Launcher funciona.",
      button: "Abrir",
      page: "about",
      bg: RATU_ASSETS.home.cardSobre
    }
  ];

  homeFeatureGrid.innerHTML = cards.map((card) => `
    <article class="feature-card">
      <img src="${card.bg}" alt="" loading="lazy" />
      <div class="feature-card-content">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.desc)}</p>
        <button class="secondary-button" data-page-go="${card.page}" type="button">${escapeHtml(card.button)} →</button>
      </div>
    </article>
  `).join("");

  homeFeatureGrid.querySelectorAll("[data-page-go]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.pageGo));
  });
}

function renderRecentSaves() {
  const library = getLibrary().slice(0, 6);

  if (library.length === 0) {
    recentSavesGrid.innerHTML = `
      <section class="empty-state">
        <div class="empty-rat">🐁</div>
        <h2>Nenhum save recente</h2>
        <p>Adicione uma ROM para começar.</p>
      </section>
    `;
    return;
  }

  recentSavesGrid.innerHTML = "";
  library.forEach((save) => recentSavesGrid.appendChild(createSaveCard(save, true)));
  attachSaveButtons(recentSavesGrid);
}

function renderHomeEmulators() {
  const emulators = getEmulators().slice(0, 4);

  homeEmulatorsGrid.innerHTML = emulators.map((emulator) => {
    const isReady = Boolean(emulator.exePath);
    return `
      <article class="emulator-card">
        <img class="emulator-art" src="${getEmulatorImage(emulator.id)}" alt="${escapeHtml(emulator.name)}" loading="lazy" />
        <div>
          <h3>${escapeHtml(emulator.name)}</h3>
          <p>${escapeHtml(emulator.systems.join(", "))}</p>
          <p>Versão ${escapeHtml(emulator.version || "?")}</p>
        </div>
        <div class="emulator-actions">
          <span class="status-pill ${isReady ? "ready" : ""}">${isReady ? "Atualizado" : "Não instalado"}</span>
        </div>
      </article>
    `;
  }).join("");
}

function renderSaves() {
  let library = getLibrary();

  if (currentSearch) {
    library = library.filter((save) => {
      const text = `${save.title} ${save.system} ${save.emulator}`.toLowerCase();
      return text.includes(currentSearch);
    });
  }

  if (currentSaveFilter === "recent") {
    library = library.filter((save) => save.lastPlayed === "Agora" || save.lastPlayed === "Hoje");
  }

  savesGrid.innerHTML = "";

  if (library.length === 0) {
    emptySaves.classList.remove("hidden");
    return;
  }

  emptySaves.classList.add("hidden");
  library.forEach((save) => savesGrid.appendChild(createSaveCard(save, false)));
  attachSaveButtons(savesGrid);
}

function createSaveCard(save, compact) {
  const normalized = normalizeGameSave(save);
  const card = document.createElement("article");
  card.className = "save-card";

  const slotsHtml = normalized.saveSlots.map((slot) => `
    <button class="slot-button ${normalized.activeSlot === slot.id ? "active" : ""}" data-action="slot" data-id="${escapeHtml(normalized.id)}" data-slot="${escapeHtml(slot.id)}" type="button">
      ${escapeHtml(slot.label)}
    </button>
  `).join("");

  const activeSlot = normalized.saveSlots.find((slot) => slot.id === normalized.activeSlot) || normalized.saveSlots[0];

  card.innerHTML = `
    <div class="save-cover-wrap">
      <img src="${toDisplaySrc(getGameCover(normalized))}" alt="${escapeHtml(normalized.title)}" loading="lazy" />
      <span class="system-badge">${escapeHtml(normalized.system)}</span>
    </div>

    <h3>${escapeHtml(normalized.title)}</h3>
    <p>${escapeHtml(normalized.emulator)} · ${escapeHtml(activeSlot.label)} · ${escapeHtml(activeSlot.lastPlayed || normalized.lastPlayed)}</p>

    <div class="save-slots">
      ${slotsHtml}
    </div>

    <div class="save-actions">
      <button class="primary-button wide" data-action="play" data-id="${escapeHtml(normalized.id)}" type="button">Jogar</button>
      ${compact ? "" : `<button class="secondary-button" data-action="cover" data-id="${escapeHtml(normalized.id)}" type="button">Trocar capa</button>`}
      ${compact ? "" : `<button class="secondary-button" data-action="details" data-id="${escapeHtml(normalized.id)}" type="button">Detalhes</button>`}
      ${compact ? "" : `<button class="danger-button wide" data-action="delete" data-id="${escapeHtml(normalized.id)}" type="button">Apagar</button>`}
    </div>
  `;

  return card;
}

function attachSaveButtons(container) {
  container.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      await handleSaveAction(button.dataset.action, button.dataset.id, button.dataset.slot);
    });
  });
}

function renderEmulators() {
  const emulators = getEmulators();
  emulatorList.innerHTML = "";

  emulators.forEach((emulator) => {
    const isReady = Boolean(emulator.exePath);
    const status = isReady ? "Pronto" : "Não instalado";
    const installOrUninstallButton = isReady
      ? `<button class="danger-button" data-action="uninstall-emulator" data-id="${escapeHtml(emulator.id)}" type="button">Desinstalar</button>`
      : `<button class="primary-button" data-action="install-emulator" data-id="${escapeHtml(emulator.id)}" type="button">Instalar</button>`;

    const card = document.createElement("article");
    card.className = "emulator-card";
    card.innerHTML = `
      <img class="emulator-art" src="${getEmulatorImage(emulator.id)}" alt="${escapeHtml(emulator.name)}" loading="lazy" />
      <div>
        <h3>${escapeHtml(emulator.name)}</h3>
        <p>${escapeHtml(emulator.systems.join(", "))}</p>
        <p>Versão ${escapeHtml(emulator.version || "?")}</p>
        <p class="emulator-path">EXE: ${escapeHtml(emulator.exePath || "Nenhum .exe selecionado")}</p>
        <p class="emulator-path">Pasta: ${escapeHtml(emulator.folderPath || "Nenhuma pasta selecionada")}</p>
      </div>
      <div class="emulator-actions">
        <span class="status-pill ${isReady ? "ready" : ""}">${escapeHtml(status)}</span>
        ${installOrUninstallButton}
        <button class="secondary-button" data-action="select-emulator-exe" data-id="${escapeHtml(emulator.id)}" type="button">Selecionar .exe</button>
        <button class="secondary-button" data-action="select-emulator-folder" data-id="${escapeHtml(emulator.id)}" type="button">Selecionar pasta</button>
      </div>
    `;

    emulatorList.appendChild(card);
  });

  emulatorList.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.action === "install-emulator") await installEmulator(button.dataset.id);
      if (button.dataset.action === "select-emulator-exe") await selectEmulatorExe(button.dataset.id);
      if (button.dataset.action === "select-emulator-folder") await selectEmulatorFolder(button.dataset.id);
      if (button.dataset.action === "uninstall-emulator") await uninstallEmulator(button.dataset.id);
    });
  });
}

async function handleSaveAction(action, id, slotId) {
  const library = getLibrary();
  const index = library.findIndex((item) => item.id === id);
  if (index === -1) {
    showToast("Save não encontrado.");
    return;
  }

  const save = normalizeGameSave(library[index]);
  library[index] = save;

  if (action === "slot") {
    save.activeSlot = slotId || "save-1";
    saveLibrary(library);
    await persistLibrary(library);
    renderAll();
    showToast(`${save.title}: ${getActiveSlot(save).label} selecionado.`);
    return;
  }

  if (action === "play") {
    await playSave(save, library);
    return;
  }

  if (action === "cover") {
    await changeGameCover(save.id);
    return;
  }

  if (action === "details") {
    const slot = getActiveSlot(save);
    alert(
      `Detalhes do jogo\n\n` +
      `Nome: ${save.title}\n` +
      `Arquivo: ${save.fileName}\n` +
      `Sistema: ${save.system}\n` +
      `Emulador: ${save.emulator}\n` +
      `Slot ativo: ${slot.label}\n` +
      `ROM: ${save.romPath || "sem caminho real"}\n` +
      `Pasta do jogo: ${save.gameFolderPath || "ainda não criada"}`
    );
    return;
  }

  if (action === "delete") {
    const confirmDelete = confirm(`Apagar ${save.title} da biblioteca?`);
    if (!confirmDelete) return;

    const updated = library.filter((item) => item.id !== id);
    saveLibrary(updated);
    await persistLibrary(updated);
    renderAll();
    showToast(`Removido: ${save.title}`);
  }
}

async function playSave(save, library) {
  if (!isTauriReady()) {
    alert("Para abrir o emulador real, rode pelo app Tauri: npm run tauri dev");
    return;
  }

  if (!save.romPath) {
    alert("Esse jogo não tem caminho real da ROM. Adicione a ROM de novo pelo app Ratu Launcher.");
    return;
  }

  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === save.emulatorId);

  if (!emulator || !emulator.exePath) {
    const installNow = confirm(
      `O emulador para ${save.system} ainda não está pronto.\n\n` +
      `Emulador necessário: ${save.emulator}\n\n` +
      "Quer instalar/configurar agora?"
    );

    if (installNow && emulator) {
      await installEmulator(emulator.id);
    } else {
      setPage("emulators");
    }
    return;
  }

  const activeSlot = getActiveSlot(save);
  activeSlot.lastPlayed = "Agora";
  save.lastPlayed = "Agora";
  save.updatedAt = new Date().toISOString();

  saveLibrary(library);
  await persistLibrary(library);
  renderAll();

  showToast(`Abrindo ${save.title} · ${activeSlot.label}...`);

  try {
    const result = await invokeRust("launch_game", {
      emulatorPath: emulator.exePath,
      romPath: save.romPath
    });
    showToast(result);
  } catch (error) {
    console.error(error);
    alert("Erro ao abrir jogo.\n\n" + String(error));
  }
}

async function selectRomWithDialog() {
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
          extensions: ["nes", "smc", "sfc", "gb", "gbc", "gba", "nds", "dsi", "n64", "z64", "v64", "cue", "bin", "iso", "3ds", "cci", "cxi", "cia", "psp", "cso", "gcm", "wbfs"]
        },
        {
          name: "Todos os arquivos",
          extensions: ["*"]
        }
      ]
    });

    if (!selected || Array.isArray(selected)) return;
    await addRomFromRealPath(selected);
  } catch (error) {
    console.error(error);
    showToast("Erro ao escolher ROM. Usando modo navegador.");
    romInput.click();
  }
}

async function addRomFromRealPath(romPath) {
  const fileName = getFileNameFromPath(romPath);
  const extension = getExtension(fileName);
  const detected = systemByExtension[extension] || {
    system: "Desconhecido",
    emulatorId: "manual",
    emulator: "Manual"
  };

  const title = cleanGameTitle(fileName);
  const id = createIdFromTitle(title);
  let gameFolderPath = "";

  if (isTauriReady()) {
    try {
      gameFolderPath = await invokeRust("create_game_folder", { gameId: id });
    } catch (error) {
      console.error(error);
    }
  }

  const save = normalizeGameSave({
    id,
    title,
    fileName,
    romPath,
    extension,
    size: 0,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    coverPath: "",
    gameFolderPath,
    folders: [],
    lastPlayed: "Novo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const library = getLibrary();
  library.unshift(save);
  saveLibrary(library);
  await persistLibrary(library);
  showToast(`Adicionado na biblioteca: ${title}`);
  setPage("saves");
}

function addRomFromBrowserFile(file) {
  const extension = getExtension(file.name);
  const detected = systemByExtension[extension] || {
    system: "Desconhecido",
    emulatorId: "manual",
    emulator: "Manual"
  };

  const title = cleanGameTitle(file.name);
  const save = normalizeGameSave({
    id: createIdFromTitle(title),
    title,
    fileName: file.name,
    romPath: "",
    extension,
    size: file.size,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    coverPath: "",
    gameFolderPath: "",
    folders: [],
    lastPlayed: "Novo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const library = getLibrary();
  library.unshift(save);
  saveLibrary(library);
  persistLibrary(library);
  showToast(`Adicionado na biblioteca: ${title}`);
  setPage("saves");
}

async function changeGameCover(gameId) {
  const library = getLibrary();
  const save = library.find((item) => item.id === gameId);
  if (!save) return;

  if (!isTauriReady()) {
    const url = prompt("Cole uma URL de imagem para usar como capa:");
    if (!url) return;
    save.coverPath = url;
    saveLibrary(library);
    await persistLibrary(library);
    renderAll();
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const selected = await open({
      multiple: false,
      directory: false,
      title: "Escolha uma capa personalizada",
      filters: [
        {
          name: "Imagens",
          extensions: ["png", "jpg", "jpeg", "webp"]
        }
      ]
    });

    if (!selected || Array.isArray(selected)) return;
    save.coverPath = selected;
    save.updatedAt = new Date().toISOString();
    saveLibrary(library);
    await persistLibrary(library);
    renderAll();
    showToast("Capa personalizada aplicada.");
  } catch (error) {
    console.error(error);
    alert("Erro ao trocar capa.\n\n" + String(error));
  }
}

function continueLastSave() {
  const library = getLibrary();
  if (library.length === 0) {
    showToast("Nenhum jogo ainda. Adicione uma ROM primeiro.");
    setPage("new-rom");
    return;
  }
  playSave(library[0], library);
}

async function installEmulator(emulatorId) {
  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === emulatorId);
  if (!emulator) {
    showToast("Emulador não encontrado.");
    return;
  }

  const confirmInstall = confirm(
    `Instalar ${emulator.name}?\n\n` +
    "O Ratu vai tentar instalar sozinho pelo Windows usando winget.\n\n" +
    "Pode demorar um pouco e talvez o Windows peça confirmação."
  );

  if (!confirmInstall) return;

  try {
    if (!isTauriReady()) throw new Error("Tauri não está disponível.");
    if (!emulator.wingetId) throw new Error("Esse emulador ainda não tem wingetId configurado.");

    showToast(`Instalando ${emulator.name}...`);
    await invokeRust("install_emulator_winget", { wingetId: emulator.wingetId });

    showToast(`Procurando ${emulator.name} no PC...`);
    const exePath = await invokeRust("detect_emulator_exe", { emulatorId: emulator.id });

    emulator.exePath = exePath;
    emulator.folderPath = getFolderFromPath(exePath);
    emulator.status = "Pronto";

    saveEmulators(emulators);
    await persistEmulators(emulators);
    renderAll();
    showToast(`${emulator.name} instalado e configurado.`);
  } catch (error) {
    console.error(error);
    const openSite = confirm("Não consegui instalar automático. Quer abrir a página oficial?");

    if (openSite && emulator.installUrl) {
      if (isTauriReady()) {
        await invokeRust("open_url", { url: emulator.installUrl });
      } else {
        window.open(emulator.installUrl, "_blank");
      }
    }
  }
}

async function selectEmulatorExe(emulatorId) {
  if (!isTauriReady()) {
    alert("Seleção de .exe só funciona dentro do app Tauri.");
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const selected = await open({
      multiple: false,
      directory: false,
      title: "Escolha o executável do emulador",
      filters: [
        { name: "Executável", extensions: ["exe"] },
        { name: "Todos os arquivos", extensions: ["*"] }
      ]
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
    console.error(error);
    alert("Erro ao escolher emulador.\n\n" + String(error));
  }
}

async function selectEmulatorFolder(emulatorId) {
  if (!isTauriReady()) {
    alert("Seleção de pasta só funciona dentro do app Tauri.");
    return;
  }

  try {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const selected = await open({
      multiple: false,
      directory: true,
      title: "Escolha a pasta do emulador"
    });

    if (!selected || Array.isArray(selected)) return;

    const emulators = getEmulators();
    const emulator = emulators.find((item) => item.id === emulatorId);
    if (!emulator) return;

    showToast(`Procurando .exe do ${emulator.name}...`);
    const exePath = await invokeRust("find_emulator_exe", { emulatorId, folderPath: selected });

    emulator.exePath = exePath;
    emulator.folderPath = selected;
    emulator.status = "Pronto";

    saveEmulators(emulators);
    await persistEmulators(emulators);
    renderAll();
    showToast(`${emulator.name} detectado sozinho.`);
  } catch (error) {
    console.error(error);
    alert("Não consegui detectar o .exe nessa pasta.\n\n" + String(error));
  }
}

async function uninstallEmulator(emulatorId) {
  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === emulatorId);
  if (!emulator) return;

  const confirmUninstall = confirm(
    `Desinstalar ${emulator.name}?\n\n` +
    "Se foi instalado pelo winget, o Ratu vai tentar desinstalar pelo winget.\n" +
    "ROMs e saves não serão apagados."
  );

  if (!confirmUninstall) return;

  try {
    let message = "Emulador desvinculado.";

    if (isTauriReady() && emulator.wingetId) {
      try {
        message = await invokeRust("uninstall_emulator_winget", { wingetId: emulator.wingetId });
      } catch (error) {
        message = await invokeRust("uninstall_emulator", {
          emulatorId: emulator.id,
          folderPath: emulator.folderPath || "",
          exePath: emulator.exePath || ""
        });
      }
    } else if (isTauriReady()) {
      message = await invokeRust("uninstall_emulator", {
        emulatorId: emulator.id,
        folderPath: emulator.folderPath || "",
        exePath: emulator.exePath || ""
      });
    }

    emulator.exePath = "";
    emulator.folderPath = "";
    emulator.status = "Pendente";

    saveEmulators(emulators);
    await persistEmulators(emulators);
    renderAll();
    showToast(message);
  } catch (error) {
    console.error(error);
    alert("Erro ao desinstalar emulador.\n\n" + String(error));
  }
}

async function resetAndRepairDefaultEmulators() {
  const confirmReset = confirm(
    "Reparar emuladores padrões?\n\n" +
    "Isso volta a lista padrão e procura os .exe automaticamente.\n" +
    "Não apaga ROMs nem saves."
  );

  if (!confirmReset) return;

  const repaired = cloneDefaultEmulators();
  let foundCount = 0;

  if (isTauriReady()) {
    showToast("Procurando emuladores instalados...");

    for (const emulator of repaired) {
      try {
        const defaultFolder = await invokeRust("get_emulator_default_folder", { emulatorId: emulator.id });
        emulator.folderPath = defaultFolder;

        let exePath = "";
        try {
          exePath = await invokeRust("find_emulator_exe", { emulatorId: emulator.id, folderPath: defaultFolder });
        } catch (error) {
          exePath = await invokeRust("detect_emulator_exe", { emulatorId: emulator.id });
        }

        emulator.exePath = exePath;
        emulator.folderPath = getFolderFromPath(exePath);
        emulator.status = "Pronto";
        foundCount += 1;
      } catch (error) {
        emulator.exePath = "";
        emulator.status = "Pendente";
      }
    }
  }

  saveEmulators(repaired);
  await persistEmulators(repaired);
  renderAll();

  if (foundCount > 0) {
    showToast(`Padrões reparados. ${foundCount} emulador(es) detectado(s).`);
  } else {
    showToast("Padrões redefinidos. Nenhum .exe foi achado.");
  }
}

function addCustomEmulator() {
  const name = prompt("Nome do emulador:");
  if (!name) return;

  const systemsText = prompt("Quais sistemas ele roda? Exemplo: PSP, PS2, GameCube");
  if (!systemsText) return;

  const systems = systemsText.split(",").map((item) => item.trim()).filter(Boolean);
  const emulators = getEmulators();

  emulators.push({
    id: createIdFromTitle(name),
    name,
    systems,
    version: "Manual",
    status: "Manual",
    exePath: "",
    folderPath: "",
    installUrl: "",
    wingetId: ""
  });

  saveEmulators(emulators);
  persistEmulators(emulators);
  renderAll();
  showToast(`Emulador adicionado: ${name}`);
}

function getLibrary() {
  return normalizeLibrary(readJson(STORAGE_LIBRARY, []));
}

function saveLibrary(library) {
  localStorage.setItem(STORAGE_LIBRARY, JSON.stringify(normalizeLibrary(library), null, 2));
}

function getEmulators() {
  const saved = readJson(STORAGE_EMULATORS, []);
  return mergeDefaultEmulators(Array.isArray(saved) ? saved : []);
}

function saveEmulators(emulators) {
  localStorage.setItem(STORAGE_EMULATORS, JSON.stringify(emulators, null, 2));
}

function mergeDefaultEmulators(saved) {
  const merged = saved.map((item) => ({
    ...item,
    version: item.version || "Atual",
    exePath: item.exePath || "",
    folderPath: item.folderPath || "",
    installUrl: item.installUrl || "",
    wingetId: item.wingetId || ""
  }));

  defaultEmulators.forEach((defaultEmulator) => {
    const existing = merged.find((item) => item.id === defaultEmulator.id);

    if (!existing) {
      merged.push({ ...defaultEmulator });
      return;
    }

    existing.name = defaultEmulator.name;
    existing.systems = defaultEmulator.systems;
    existing.installUrl = defaultEmulator.installUrl;
    existing.wingetId = defaultEmulator.wingetId;
    existing.version = existing.version || defaultEmulator.version;
  });

  return merged;
}

function cloneDefaultEmulators() {
  return JSON.parse(JSON.stringify(defaultEmulators));
}

function normalizeLibrary(library) {
  if (!Array.isArray(library)) return [];
  return library.map((item) => normalizeGameSave(item));
}

function normalizeGameSave(save) {
  const id = save.id || createIdFromTitle(save.title || save.fileName || "game");

  const saveSlots = Array.isArray(save.saveSlots) && save.saveSlots.length === 3
    ? save.saveSlots
    : [
        { id: "save-1", label: "Save 1", lastPlayed: save.lastPlayed || "Novo" },
        { id: "save-2", label: "Save 2", lastPlayed: "Vazio" },
        { id: "save-3", label: "Save 3", lastPlayed: "Vazio" }
      ];

  return {
    ...save,
    id,
    title: save.title || cleanGameTitle(save.fileName || "Jogo sem nome"),
    fileName: save.fileName || "",
    romPath: save.romPath || "",
    extension: save.extension || getExtension(save.fileName || ""),
    size: save.size || 0,
    system: save.system || "Desconhecido",
    emulatorId: save.emulatorId || "manual",
    emulator: save.emulator || "Manual",
    coverPath: save.coverPath || "",
    gameFolderPath: save.gameFolderPath || "",
    folders: Array.isArray(save.folders) ? save.folders : [],
    activeSlot: save.activeSlot || "save-1",
    saveSlots,
    lastPlayed: save.lastPlayed || "Novo",
    createdAt: save.createdAt || new Date().toISOString(),
    updatedAt: save.updatedAt || new Date().toISOString()
  };
}

function getActiveSlot(save) {
  return save.saveSlots.find((slot) => slot.id === save.activeSlot) || save.saveSlots[0];
}

async function persistLibrary(library) {
  if (!isTauriReady()) return;
  try {
    await invokeRust("save_library_file", { json: JSON.stringify(normalizeLibrary(library), null, 2) });
  } catch (error) {
    console.error(error);
  }
}

async function persistEmulators(emulators) {
  if (!isTauriReady()) return;
  try {
    await invokeRust("save_emulators_file", { json: JSON.stringify(emulators, null, 2) });
  } catch (error) {
    console.error(error);
  }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function safeParseJson(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function isTauriReady() {
  return Boolean(window.__TAURI__?.core?.invoke);
}

async function invokeRust(command, args = {}) {
  const invoke = window.__TAURI__?.core?.invoke;
  if (!invoke) throw new Error("Tauri não está disponível.");
  return await invoke(command, args);
}

function toDisplaySrc(src) {
  if (!src) return getEmulatorImage("manual");

  const isLocalPath = /^[a-zA-Z]:\\/.test(src) || src.startsWith("/");
  const convertFileSrc = window.__TAURI__?.core?.convertFileSrc;

  if (isLocalPath && typeof convertFileSrc === "function") {
    return convertFileSrc(src);
  }

  return src;
}

function getExtension(fileName) {
  const parts = String(fileName).split(".");
  if (parts.length <= 1) return "";
  return parts.pop().toLowerCase().trim();
}

function getFileNameFromPath(path) {
  return String(path).replaceAll("\\", "/").split("/").pop();
}

function getFolderFromPath(path) {
  const normalized = String(path).replaceAll("\\", "/");
  const parts = normalized.split("/");
  parts.pop();
  return parts.join("/");
}

function cleanGameTitle(fileName) {
  return String(fileName)
    .replace(/\.[^/.]+$/, "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createIdFromTitle(title) {
  const clean = String(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${clean || "game"}-${Date.now()}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
