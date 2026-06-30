const BASE = "./assets/images/Assets-Ratu-launcher";
const IMG = "./assets/images";

const asset = (path) => encodeURI(`${BASE}/${path}`);
const image = (path) => encodeURI(`${IMG}/${path}`);

export const RATU_ASSETS = {
  home: {
    cardSaves: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/01_card_saves_model.png"),
    cardNovaRom: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/02_card_nova_rom_model.png"),
    cardSobre: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/03_card_sobre_model.png"),
    gameCardModel: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/04_game_card_model.png"),
    buttonArrowModel: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/05_button_arrow_model.png"),
    emulatorCardModel: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/06_card_emulator_model.png"),
    buttonTextArrowModel: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/07_button_text_arrow_model.png"),
    sidebarHomeItem: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/08_sidebar_home_item.png"),
    smallIconDetail: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/09_small_icon_detail.png"),
  },

  saves: {
    folderCardRat: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/02_folder_card_rat.png"),
    searchBar: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/03_search_bar.png"),
    filterButton: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/04_filter_button.png"),
    newFolderButton: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/05_new_folder_button.png"),
    importButton: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/06_import_button.png"),
    syncButton: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/07_sync_button.png"),
    saveRowModel: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/08_save_row_model.png"),
    playerCardEmpty: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/09_player_card_empty.png"),
    sleepingRat: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/10_sleeping_rat.png"),
  },

  rats: {
    right: asset("RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_direita_sem_fundo.png"),
    left: asset("RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_esquerda_sem_fundo.png"),
  },

  emulators: {
    mgba: image("emulators/mGBA.png"),
    melonds: image("emulators/melonDS.png"),
    azahar: image("emulators/Azahar.png"),
    mupen64plus: image("emulators/Mupen64.png"),
    duckstation: image("emulators/DuckStation.png"),
    snes9x: image("emulators/Mesen-S.png"),
    nestopia: image("emulators/FCEUX.png"),
    ppsspp: image("emulators/PPSSPP.png"),
    dolphin: image("emulators/Dolphin.png"),
    manual: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/06_card_emulator_model.png"),
  },
};

export function getEmulatorImage(emulatorId) {
  return RATU_ASSETS.emulators[emulatorId] || RATU_ASSETS.emulators.manual;
}

export function getGameCover(game) {
  if (game?.coverPath) return game.coverPath;
  return getEmulatorImage(game?.emulatorId || "manual");
}
