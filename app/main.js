const splash = document.getElementById("splash");
const app = document.getElementById("app");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const menuButtons = document.querySelectorAll(".menu-button");
const pages = document.querySelectorAll(".page");

const savesGrid = document.getElementById("savesGrid");
const recentSavesGrid = document.getElementById("recentSavesGrid");
const emptySaves = document.getElementById("emptySaves");

const homeSaveCount = document.getElementById("homeSaveCount");
const homeEmulatorCount = document.getElementById("homeEmulatorCount");

const quickAddButton = document.getElementById("quickAddButton");
const homeAddRomButton = document.getElementById("homeAddRomButton");
const homeContinueButton = document.getElementById("homeContinueButton");
const viewAllSavesButton = document.getElementById("viewAllSavesButton");
const emptyAddButton = document.getElementById("emptyAddButton");

const uploadBox = document.getElementById("uploadBox");
const romInput = document.getElementById("romInput");

const emulatorList = document.getElementById("emulatorList");
const addEmulatorButton = document.getElementById("addEmulatorButton");

const toast = document.getElementById("toast");

const STORAGE_LIBRARY = "ratu_library_v4";
const STORAGE_EMULATORS = "ratu_emulators_v4";

const pageInfo = {
  home: {
    title: "Home",
    subtitle: "Seu painel rápido do Ratu Launcher."
  },
  saves: {
    title: "Saves",
    subtitle: "Todos os seus jogos salvos."
  },
  "new-rom": {
    title: "Nova ROM",
    subtitle: "Adicione uma ROM e crie um novo card de jogo."
  },
  emulators: {
    title: "Emuladores",
    subtitle: "Motores instalados que ficam por trás dos saves."
  },
  faq: {
    title: "FAQ",
    subtitle: "Perguntas rápidas sobre o Ratu Launcher."
  }
};

const systemByExtension = {
  nes: {
    system: "NES",
    emulatorId: "nestopia",
    emulator: "FCEUX",
    icon: "🕹️"
  },
  smc: {
    system: "SNES",
    emulatorId: "snes9x",
    emulator: "Mesen-S",
    icon: "🎮"
  },
  sfc: {
    system: "SNES",
    emulatorId: "snes9x",
    emulator: "Mesen-S",
    icon: "🎮"
  },
  gb: {
    system: "Game Boy",
    emulatorId: "mgba",
    emulator: "mGBA",
    icon: "🟩"
  },
  gbc: {
    system: "Game Boy Color",
    emulatorId: "mgba",
    emulator: "mGBA",
    icon: "🟩"
  },
  gba: {
    system: "Game Boy Advance",
    emulatorId: "mgba",
    emulator: "mGBA",
    icon: "🟦"
  },
  nds: {
    system: "Nintendo DS",
    emulatorId: "melonds",
    emulator: "melonDS",
    icon: "📘"
  },
  dsi: {
    system: "Nintendo DS",
    emulatorId: "melonds",
    emulator: "melonDS",
    icon: "📘"
  },
  n64: {
    system: "Nintendo 64",
    emulatorId: "mupen64plus",
    emulator: "Mupen64",
    icon: "🟨"
  },
  z64: {
    system: "Nintendo 64",
    emulatorId: "mupen64plus",
    emulator: "Mupen64",
    icon: "🟨"
  },
  v64: {
    system: "Nintendo 64",
    emulatorId: "mupen64plus",
    emulator: "Mupen64",
    icon: "🟨"
  },
  cue: {
    system: "PlayStation",
    emulatorId: "duckstation",
    emulator: "DuckStation",
    icon: "💿"
  },
  bin: {
    system: "PlayStation",
    emulatorId: "duckstation",
    emulator: "DuckStation",
    icon: "💿"
  },
  iso: {
    system: "Disc Image",
    emulatorId: "duckstation",
    emulator: "DuckStation",
    icon: "💽"
  },
  "3ds": {
    system: "Nintendo 3DS",
    emulatorId: "azahar",
    emulator: "Azahar",
    icon: "📕"
  },
  cci: {
    system: "Nintendo 3DS",
    emulatorId: "azahar",
    emulator: "Azahar",
    icon: "📕"
  },
  cxi: {
    system: "Nintendo 3DS",
    emulatorId: "azahar",
    emulator: "Azahar",
    icon: "📕"
  },
  cia: {
    system: "Nintendo 3DS",
    emulatorId: "azahar",
    emulator: "Azahar",
    icon: "📕"
  },
  psp: {
    system: "PSP",
    emulatorId: "ppsspp",
    emulator: "PPSSPP",
    icon: "🎴"
  },
  cso: {
    system: "PSP",
    emulatorId: "ppsspp",
    emulator: "PPSSPP",
    icon: "🎴"
  },
  gcm: {
    system: "GameCube",
    emulatorId: "dolphin",
    emulator: "Dolphin",
    icon: "🐬"
  },
  wbfs: {
    system: "Wii",
    emulatorId: "dolphin",
    emulator: "Dolphin",
    icon: "🐬"
  }
};

const defaultEmulators = [
  {
    id: "mgba",
    name: "mGBA",
    systems: ["Game Boy Advance", "Game Boy", "Game Boy Color"],
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
    status: "Pendente",
    exePath: "",
    folderPath: "",
    installUrl: "https://dolphin-emu.org/download/",
    wingetId: "DolphinEmulator.Dolphin"
  }
];

const defaultLibrary = [];

startApp();

async function startApp() {
  await initializeData();
  setupEvents();
  createResetDefaultEmulatorsButton();

  setTimeout(() => {
    splash.classList.add("hidden");
    app.classList.remove("hidden");
    setPage("home");
    renderAll();
  }, 1100);
}

async function initializeData() {
  seedStorage();

  if (!isTauriReady()) {
    return;
  }

  try {
    const root = await invokeRust("ensure_ratu_data_folder");
    console.log("Pasta do Ratu:", root);

    const libraryJson = await invokeRust("load_library_file");
    const emulatorsJson = await invokeRust("load_emulators_file");

    const library = safeParseJson(libraryJson, []);
    const emulatorsFromFile = safeParseJson(emulatorsJson, []);

    if (Array.isArray(library)) {
      localStorage.setItem(STORAGE_LIBRARY, JSON.stringify(library, null, 2));
    }

    if (Array.isArray(emulatorsFromFile) && emulatorsFromFile.length > 0) {
      const merged = mergeDefaultEmulators(emulatorsFromFile);
      localStorage.setItem(STORAGE_EMULATORS, JSON.stringify(merged, null, 2));
      await persistEmulators(merged);
    } else {
      await persistEmulators(getEmulators());
    }
  } catch (error) {
    console.error(error);
    showToast("Não consegui carregar arquivos locais do Ratu.");
  }
}

function setupEvents() {
  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPage(button.dataset.page);
    });
  });

  quickAddButton.addEventListener("click", () => {
    setPage("new-rom");
  });

  homeAddRomButton.addEventListener("click", () => {
    setPage("new-rom");
  });

  viewAllSavesButton.addEventListener("click", () => {
    setPage("saves");
  });

  homeContinueButton.addEventListener("click", () => {
    continueLastSave();
  });

  emptyAddButton.addEventListener("click", () => {
    setPage("new-rom");
  });

  uploadBox.addEventListener("click", async () => {
    await selectRomWithDialog();
  });

  romInput.addEventListener("change", () => {
    const file = romInput.files[0];

    if (!file) {
      return;
    }

    addRomFromBrowserFile(file);
    romInput.value = "";
  });

  addEmulatorButton.addEventListener("click", () => {
    addCustomEmulator();
  });
}

function createResetDefaultEmulatorsButton() {
  if (!addEmulatorButton) {
    return;
  }

  if (document.getElementById("resetDefaultEmulatorsButton")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "resetDefaultEmulatorsButton";
  button.className = "secondary-button";
  button.textContent = "Reparar padrões";

  button.addEventListener("click", async () => {
    await resetAndRepairDefaultEmulators();
  });

  addEmulatorButton.insertAdjacentElement("afterend", button);
}

async function resetAndRepairDefaultEmulators() {
  const confirmReset = confirm(
    "Reparar emuladores padrões?\n\n" +
    "Isso vai voltar a lista padrão e procurar os .exe automaticamente dentro de:\n\n" +
    "Documentos/Ratu Launcher/emulators/\n" +
    "Program Files\n" +
    "AppData Local\n\n" +
    "Não apaga suas ROMs nem seus saves."
  );

  if (!confirmReset) {
    return;
  }

  let repaired = cloneDefaultEmulators();
  let foundCount = 0;

  if (isTauriReady()) {
    showToast("Procurando emuladores instalados...");

    for (const emulator of repaired) {
      try {
        const defaultFolder = await invokeRust("get_emulator_default_folder", {
          emulatorId: emulator.id
        });

        emulator.folderPath = defaultFolder;

        let exePath = "";

        try {
          exePath = await invokeRust("find_emulator_exe", {
            emulatorId: emulator.id,
            folderPath: defaultFolder
          });
        } catch (error) {
          exePath = await invokeRust("detect_emulator_exe", {
            emulatorId: emulator.id
          });
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

function cloneDefaultEmulators() {
  return JSON.parse(JSON.stringify(defaultEmulators));
}

function seedStorage() {
  if (!localStorage.getItem(STORAGE_LIBRARY)) {
    saveLibrary(defaultLibrary);
  }

  if (!localStorage.getItem(STORAGE_EMULATORS)) {
    saveEmulators(cloneDefaultEmulators());
  }
}

function setPage(pageName) {
  const info = pageInfo[pageName];

  if (!info) {
    return;
  }

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

  homeSaveCount.textContent = String(library.length);
  homeEmulatorCount.textContent = String(emulators.length);

  recentSavesGrid.innerHTML = "";

  const recent = library.slice(0, 3);

  if (recent.length === 0) {
    recentSavesGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-rat">🐀</div>
        <h2>Nenhum save recente</h2>
        <p>Adicione uma ROM para começar.</p>
      </div>
    `;

    return;
  }

  recent.forEach((save) => {
    recentSavesGrid.appendChild(createSaveCard(save));
  });

  attachSaveButtons(recentSavesGrid);
}

function renderSaves() {
  const library = getLibrary();

  savesGrid.innerHTML = "";

  if (library.length === 0) {
    emptySaves.classList.remove("hidden");
    return;
  }

  emptySaves.classList.add("hidden");

  library.forEach((save) => {
    savesGrid.appendChild(createSaveCard(save));
  });

  attachSaveButtons(savesGrid);
}

function attachSaveButtons(container) {
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      handleSaveAction(button.dataset.action, button.dataset.id);
    });
  });
}

function createSaveCard(save) {
  const card = document.createElement("article");
  card.className = "save-card";

  const coverContent = save.coverPath
    ? `<img src="${escapeHtml(save.coverPath)}" alt="${escapeHtml(save.title)}" />`
    : `<span>${escapeHtml(save.icon || "🎮")}</span>`;

  card.innerHTML = `
    <div class="save-cover">
      ${coverContent}
    </div>

    <div class="save-body">
      <h2>${escapeHtml(save.title)}</h2>

      <div class="save-meta">
        <span class="tag">${escapeHtml(save.system)}</span>
        <span class="tag">${escapeHtml(save.emulator)}</span>
        <span class="tag">${escapeHtml(save.lastPlayed)}</span>
      </div>

      <div class="save-actions">
        <button class="primary-button" data-action="play" data-id="${escapeHtml(save.id)}">
          Continuar
        </button>

        <button class="secondary-button" data-action="details" data-id="${escapeHtml(save.id)}">
          Detalhes
        </button>

        <button class="danger-button" data-action="delete" data-id="${escapeHtml(save.id)}">
          Apagar
        </button>
      </div>
    </div>
  `;

  return card;
}

function renderEmulators() {
  const emulators = getEmulators();

  emulatorList.innerHTML = "";

  emulators.forEach((emulator) => {
    const isReady = Boolean(emulator.exePath);
    const status = isReady ? "Pronto" : "Não instalado";

    const installOrUninstallButton = isReady
      ? `<button class="danger-button" data-action="uninstall-emulator" data-id="${escapeHtml(emulator.id)}">Desinstalar</button>`
      : `<button class="primary-button" data-action="install-emulator" data-id="${escapeHtml(emulator.id)}">Instalar</button>`;

    const card = document.createElement("article");
    card.className = "emulator-card";

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(emulator.name)}</h3>
        <p>${escapeHtml(emulator.systems.join(", "))}</p>

        <p class="emulator-path">
          EXE: ${escapeHtml(emulator.exePath || "Nenhum .exe selecionado")}
        </p>

        <p class="emulator-path">
          Pasta: ${escapeHtml(emulator.folderPath || "Nenhuma pasta selecionada")}
        </p>
      </div>

      <div class="emulator-actions">
        <span class="emulator-badge">${escapeHtml(status)}</span>

        ${installOrUninstallButton}

        <button class="secondary-button" data-action="select-emulator-exe" data-id="${escapeHtml(emulator.id)}">
          Selecionar .exe
        </button>

        <button class="secondary-button" data-action="select-emulator-folder" data-id="${escapeHtml(emulator.id)}">
          Selecionar pasta
        </button>
      </div>
    `;

    emulatorList.appendChild(card);
  });

  emulatorList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.action === "install-emulator") {
        await installEmulator(button.dataset.id);
      }

      if (button.dataset.action === "select-emulator-exe") {
        await selectEmulatorExe(button.dataset.id);
      }

      if (button.dataset.action === "select-emulator-folder") {
        await selectEmulatorFolder(button.dataset.id);
      }

      if (button.dataset.action === "uninstall-emulator") {
        await uninstallEmulator(button.dataset.id);
      }
    });
  });
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

  if (!confirmInstall) {
    return;
  }

  try {
    if (!emulator.wingetId) {
      throw new Error("Esse emulador ainda não tem wingetId configurado.");
    }

    if (isTauriReady()) {
      showToast(`Instalando ${emulator.name} pelo winget...`);

      await invokeRust("install_emulator_winget", {
        wingetId: emulator.wingetId
      });

      showToast(`Procurando ${emulator.name} no PC...`);

      const exePath = await invokeRust("detect_emulator_exe", {
        emulatorId: emulator.id
      });

      emulator.exePath = exePath;
      emulator.folderPath = getFolderFromPath(exePath);
      emulator.status = "Pronto";

      saveEmulators(emulators);
      await persistEmulators(emulators);

      renderAll();
      showToast(`${emulator.name} instalado e configurado.`);
      return;
    }

    throw new Error("Tauri não está disponível.");
  } catch (error) {
    console.error(error);

    const openSite = confirm(
      "Não consegui instalar automático.\n\n" +
      "Quer abrir a página oficial de download?"
    );

    if (openSite && emulator.installUrl) {
      if (isTauriReady()) {
        await invokeRust("open_url", {
          url: emulator.installUrl
        });
      } else {
        window.open(emulator.installUrl, "_blank");
      }
    }
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
            "cue",
            "bin",
            "iso",
            "3ds",
            "cci",
            "cxi",
            "cia",
            "psp",
            "cso",
            "gcm",
            "wbfs"
          ]
        },
        {
          name: "Todos os arquivos",
          extensions: ["*"]
        }
      ]
    });

    if (!selected || Array.isArray(selected)) {
      return;
    }

    await addRomFromRealPath(selected);
  } catch (error) {
    console.error(error);
    showToast("Erro ao escolher ROM. Usando modo navegador.");
    romInput.click();
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
        {
          name: "Executável",
          extensions: ["exe"]
        },
        {
          name: "Todos os arquivos",
          extensions: ["*"]
        }
      ]
    });

    if (!selected || Array.isArray(selected)) {
      return;
    }

    const emulators = getEmulators();
    const emulator = emulators.find((item) => item.id === emulatorId);

    if (!emulator) {
      showToast("Emulador não encontrado.");
      return;
    }

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

    if (!selected || Array.isArray(selected)) {
      return;
    }

    const emulators = getEmulators();
    const emulator = emulators.find((item) => item.id === emulatorId);

    if (!emulator) {
      showToast("Emulador não encontrado.");
      return;
    }

    showToast(`Procurando .exe do ${emulator.name}...`);

    const exePath = await invokeRust("find_emulator_exe", {
      emulatorId,
      folderPath: selected
    });

    emulator.exePath = exePath;
    emulator.folderPath = selected;
    emulator.status = "Pronto";

    saveEmulators(emulators);
    await persistEmulators(emulators);

    renderAll();
    showToast(`${emulator.name} detectado sozinho.`);
  } catch (error) {
    console.error(error);
    alert(
      "Não consegui detectar o .exe nessa pasta.\n\n" +
      "Tenta selecionar o .exe manualmente ou manda print da pasta.\n\n" +
      String(error)
    );
  }
}

async function uninstallEmulator(emulatorId) {
  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === emulatorId);

  if (!emulator) {
    showToast("Emulador não encontrado.");
    return;
  }

  const confirmUninstall = confirm(
    `Desinstalar ${emulator.name}?\n\n` +
    "Se foi instalado pelo winget, o Ratu vai tentar desinstalar pelo winget.\n" +
    "Se estiver dentro da pasta do Ratu, os arquivos do emulador serão apagados.\n" +
    "Se estiver fora, o Ratu só vai desvincular.\n\n" +
    "ROMs e saves não serão apagados."
  );

  if (!confirmUninstall) {
    return;
  }

  try {
    let message = "Emulador desvinculado.";

    if (isTauriReady() && emulator.wingetId) {
      try {
        message = await invokeRust("uninstall_emulator_winget", {
          wingetId: emulator.wingetId
        });
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

async function addRomFromRealPath(romPath) {
  const fileName = getFileNameFromPath(romPath);
  const extension = getExtension(fileName);

  const detected = systemByExtension[extension] || {
    system: "Desconhecido",
    emulatorId: "manual",
    emulator: "Manual",
    icon: "📦"
  };

  const title = cleanGameTitle(fileName);
  const id = createIdFromTitle(title);
  let gameFolderPath = "";

  if (isTauriReady()) {
    try {
      gameFolderPath = await invokeRust("create_game_folder", {
        gameId: id
      });
    } catch (error) {
      console.error(error);
    }
  }

  const save = {
    id,
    title,
    fileName,
    romPath,
    extension,
    size: 0,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    icon: detected.icon,
    coverPath: "",
    gameFolderPath,
    folders: [],
    lastPlayed: "Novo",
    createdAt: new Date().toISOString()
  };

  const library = getLibrary();
  library.unshift(save);

  saveLibrary(library);
  await persistLibrary(library);

  showToast(`Save criado: ${title}`);
  setPage("home");
}

function addRomFromBrowserFile(file) {
  const extension = getExtension(file.name);

  const detected = systemByExtension[extension] || {
    system: "Desconhecido",
    emulatorId: "manual",
    emulator: "Manual",
    icon: "📦"
  };

  const title = cleanGameTitle(file.name);

  const save = {
    id: createIdFromTitle(title),
    title,
    fileName: file.name,
    romPath: "",
    extension,
    size: file.size,
    system: detected.system,
    emulatorId: detected.emulatorId,
    emulator: detected.emulator,
    icon: detected.icon,
    coverPath: "",
    gameFolderPath: "",
    folders: [],
    lastPlayed: "Novo",
    createdAt: new Date().toISOString()
  };

  const library = getLibrary();
  library.unshift(save);

  saveLibrary(library);
  persistLibrary(library);

  showToast(`Save criado: ${title}`);
  setPage("home");
}

function continueLastSave() {
  const library = getLibrary();

  if (library.length === 0) {
    showToast("Nenhum save ainda. Adicione uma ROM primeiro.");
    setPage("new-rom");
    return;
  }

  handleSaveAction("play", library[0].id);
}

function addCustomEmulator() {
  const name = prompt("Nome do emulador:");

  if (!name) {
    return;
  }

  const systemsText = prompt("Quais sistemas ele roda? Exemplo: PSP, PS2, GameCube");

  if (!systemsText) {
    return;
  }

  const systems = systemsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const emulators = getEmulators();

  emulators.push({
    id: createIdFromTitle(name),
    name,
    systems,
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

async function handleSaveAction(action, id) {
  const library = getLibrary();
  const save = library.find((item) => item.id === id);

  if (!save) {
    showToast("Save não encontrado.");
    return;
  }

  if (action === "play") {
    await playSave(save, library);
    return;
  }

  if (action === "details") {
    alert(
      `Detalhes do save\n\n` +
      `Nome: ${save.title}\n` +
      `Arquivo: ${save.fileName}\n` +
      `Sistema: ${save.system}\n` +
      `Emulador: ${save.emulator}\n` +
      `ROM: ${save.romPath || "sem caminho real"}\n` +
      `Pasta do jogo: ${save.gameFolderPath || "ainda não criada"}\n` +
      `Tamanho: ${formatBytes(save.size)}`
    );

    return;
  }

  if (action === "delete") {
    const confirmDelete = confirm(`Apagar o save de ${save.title}?`);

    if (!confirmDelete) {
      return;
    }

    const updated = library.filter((item) => item.id !== id);
    saveLibrary(updated);
    await persistLibrary(updated);
    renderAll();

    showToast(`Save apagado: ${save.title}`);
  }
}

async function playSave(save, library) {
  if (!isTauriReady()) {
    alert("Para abrir o emulador real, rode pelo app Tauri: npm run tauri dev");
    return;
  }

  if (!save.romPath) {
    alert(
      "Esse save foi criado no modo navegador e não tem caminho real da ROM.\n\n" +
      "Adicione a ROM de novo dentro do app Ratu Launcher."
    );
    return;
  }

  const emulators = getEmulators();
  const emulator = emulators.find((item) => item.id === save.emulatorId);

  if (!emulator || !emulator.exePath) {
    const installNow = confirm(
      `O emulador para ${save.system} ainda não foi instalado.\n\n` +
      `Sistema: ${save.system}\n` +
      `Emulador necessário: ${save.emulator}\n\n` +
      "Quer instalar agora pelo Windows?"
    );

    if (installNow && emulator) {
      await installEmulator(emulator.id);
    } else {
      setPage("emulators");
    }

    return;
  }

  save.lastPlayed = "Agora";
  saveLibrary(library);
  await persistLibrary(library);
  renderAll();

  showToast(`Abrindo ${save.title}...`);

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

function getLibrary() {
  return readJson(STORAGE_LIBRARY, []);
}

function saveLibrary(library) {
  localStorage.setItem(STORAGE_LIBRARY, JSON.stringify(library, null, 2));
}

function getEmulators() {
  const saved = readJson(STORAGE_EMULATORS, []);

  if (!Array.isArray(saved) || saved.length === 0) {
    return cloneDefaultEmulators();
  }

  return mergeDefaultEmulators(saved);
}

function mergeDefaultEmulators(saved) {
  const merged = saved.map((item) => ({
    ...item,
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
  });

  return merged;
}

function saveEmulators(emulators) {
  localStorage.setItem(STORAGE_EMULATORS, JSON.stringify(emulators, null, 2));
}

async function persistLibrary(library) {
  if (!isTauriReady()) {
    return;
  }

  try {
    await invokeRust("save_library_file", {
      json: JSON.stringify(library, null, 2)
    });
  } catch (error) {
    console.error(error);
  }
}

async function persistEmulators(emulators) {
  if (!isTauriReady()) {
    return;
  }

  try {
    await invokeRust("save_emulators_file", {
      json: JSON.stringify(emulators, null, 2)
    });
  } catch (error) {
    console.error(error);
  }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

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

  if (!invoke) {
    throw new Error("Tauri não está disponível.");
  }

  return await invoke(command, args);
}

function getExtension(fileName) {
  const parts = String(fileName).split(".");

  if (parts.length <= 1) {
    return "";
  }

  return parts.pop().toLowerCase().trim();
}

function getFileNameFromPath(path) {
  return String(path)
    .replaceAll("\\", "/")
    .split("/")
    .pop();
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

  showToast.timeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2400);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}