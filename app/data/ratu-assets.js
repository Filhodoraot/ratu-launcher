const BASE = "./assets/images";
const RATU_BASE = `${BASE}/Assets-Ratu-launcher`;
const LOTE2 = `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais`;
const PACK1 = `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO`;
const LOTE4 = `${RATU_BASE}/RATU_LOTE4_EMULADORES_SEM_FUNDO`;
const MENU = `${RATU_BASE}/MenuLateral`;

export const RATU_ASSETS = {
  logo: {
    full: `${PACK1}/image-removebg-preview (32).png`,
  },

  rat: {
    sleeping: `${PACK1}/10_sleeping_rat.png`,
  },

  menu: {
    home: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_24 (2).png`,
    homeActive: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_26 (8).png`,

    saves: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_25 (6).png`,
    savesActive: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_23 (1).png`,

    newRom: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_24 (3).png`,
    newRomActive: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_24 (3).png`,

    about: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_25 (7).png`,
    aboutActive: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_25 (5).png`,

    emulators: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_26 (10).png`,
    emulatorsActive: `${MENU}/ChatGPT Image 29 de jun. de 2026, 19_27_26 (9).png`,
  },

  home: {
    cardSaves: `${LOTE2}/01_card_saves_model.png`,
    cardNovaRom: `${LOTE2}/02_card_nova_rom_model.png`,
    cardSobre: `${LOTE2}/03_card_sobre_model.png`,
    gameCard: `${LOTE2}/04_game_card_model.png`,
    emulatorCard: `${LOTE2}/06_card_emulator_model.png`,
  },

  saves: {
    folderCard: `${PACK1}/02_folder_card_rat.png`,
    searchBar: `${PACK1}/03_search_bar.png`,
    filterButton: `${PACK1}/04_filter_button.png`,
    newFolderButton: `${PACK1}/05_new_folder_button.png`,
    importButton: `${PACK1}/06_import_button.png`,
    syncButton: `${PACK1}/07_sync_button.png`,
    saveRow: `${PACK1}/08_save_row_model.png`,
    playerCard: `${PACK1}/09_player_card_empty.png`,
  },

  panels: {
    emulatorCard: `${LOTE4}/03_cartão_ui_moderno_em_modo_escuro.png`,
    emulatorInfo: `${LOTE4}/02_painel_de_ui_com_ícone_de_info.png`,
    darkPanel: `${LOTE4}/10_mockup_de_painel_escuro_minimalista.png`,
  },

  emulators: {
    mgba: `${BASE}/emulators/mGBA.png`,
    melonds: `${BASE}/emulators/melonDS.png`,
    mupen64plus: `${BASE}/emulators/Mupen64.png`,
    azahar: `${BASE}/emulators/Azahar.png`,
    snes9x: `${BASE}/emulators/Mesen-S.png`,
    nestopia: `${BASE}/emulators/FCEUX.png`,
    duckstation: `${BASE}/emulators/DuckStation.png`,
    ppsspp: `${BASE}/emulators/PPSSPP.png`,
    dolphin: `${BASE}/emulators/Dolphin.png`,
    manual: `${BASE}/emulators/mGBA.png`,
  },
};

export function assetUrl(path) {
  if (!path) return "";

  const value = String(path);

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("http")
  ) {
    return value;
  }

  return encodeURI(value);
}

export function getEmulatorImage(emulatorId) {
  return assetUrl(RATU_ASSETS.emulators[emulatorId] || RATU_ASSETS.emulators.manual);
}

export function getGameCover(game) {
  if (game?.coverPath) {
    const value = String(game.coverPath);

    if (
      value.startsWith("data:") ||
      value.startsWith("blob:") ||
      value.startsWith("http") ||
      value.startsWith("./")
    ) {
      return value;
    }

    const convertFileSrc = window.__TAURI__?.core?.convertFileSrc;
    if (typeof convertFileSrc === "function") return convertFileSrc(value);

    return `file:///${value.replaceAll("\\", "/")}`;
  }

  return getEmulatorImage(game?.emulatorId);
}