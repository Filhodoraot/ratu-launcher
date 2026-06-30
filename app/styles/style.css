const BASE = "./assets/images";
const RATU_BASE = `${BASE}/Assets-Ratu-launcher`;

export const RATU_ASSETS = {
  geral: {
    logoRat: `${RATU_BASE}/ImagemGeral/add8cb03-c912-48ea-ab0b-1b6a483278a5.png`,
    ratRight: `${RATU_BASE}/RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_direita_sem_fundo.png`,
    ratLeft: `${RATU_BASE}/RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_esquerda_sem_fundo.png`,
    sleepingRat: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/10_sleeping_rat.png`,
  },

  home: {
    cardSaves: `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/01_card_saves_model.png`,
    cardNovaRom: `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/02_card_nova_rom_model.png`,
    cardSobre: `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/03_card_sobre_model.png`,
    gameCard: `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/04_game_card_model.png`,
    emulatorCard: `${RATU_BASE}/RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/06_card_emulator_model.png`,
  },

  saves: {
    folderCard: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/02_folder_card_rat.png`,
    searchBar: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/03_search_bar.png`,
    filterButton: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/04_filter_button.png`,
    newFolderButton: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/05_new_folder_button.png`,
    importButton: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/06_import_button.png`,
    syncButton: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/07_sync_button.png`,
    row: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/08_save_row_model.png`,
    playerCard: `${RATU_BASE}/PACOTE_1_RATU_ASSETS_ATUALIZADO/09_player_card_empty.png`,
  },

  panels: {
    darkPanel: `${RATU_BASE}/RATU_LOTE3_CORRIGIDO_SEM_FUNDO/01_painel_de_ui_com_fundo_transparente.png`,
    modernPanel: `${RATU_BASE}/RATU_LOTE3_CORRIGIDO_SEM_FUNDO/02_painel_ui_moderno_com_bordas_arredondadas.png`,
    emulatorPanel: `${RATU_BASE}/RATU_LOTE4_EMULADORES_SEM_FUNDO/01_painel_de_ui_com_gradiente_suave.png`,
    emulatorInfo: `${RATU_BASE}/RATU_LOTE4_EMULADORES_SEM_FUNDO/02_painel_de_ui_com_ícone_de_info.png`,
    emulatorCard: `${RATU_BASE}/RATU_LOTE4_EMULADORES_SEM_FUNDO/03_cartão_ui_moderno_em_modo_escuro.png`,
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

export function getEmulatorImage(emulatorId) {
  return RATU_ASSETS.emulators[emulatorId] || RATU_ASSETS.emulators.manual;
}

export function getDisplayImage(path) {
  if (!path) return "";

  const value = String(path);

  if (
    value.startsWith("./") ||
    value.startsWith("/") ||
    value.startsWith("http") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const convertFileSrc = window.__TAURI__?.core?.convertFileSrc;

  if (typeof convertFileSrc === "function") {
    return convertFileSrc(value);
  }

  return `file:///${value.replaceAll("\\", "/")}`;
}

export function getGameCover(game) {
  const customCover = getDisplayImage(game?.coverPath);

  if (customCover) return customCover;

  return getEmulatorImage(game?.emulatorId);
}