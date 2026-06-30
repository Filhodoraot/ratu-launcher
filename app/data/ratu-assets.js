// app/data/ratu-assets.js
// Mapa central dos assets do Ratu Launcher.
// Copie a pasta do repo "Assets-Ratu-launcher" para:
// app/assets/images/Assets-Ratu-launcher/

const BASE = "./assets/images/Assets-Ratu-launcher";

const asset = (path) => encodeURI(`${BASE}/${path}`);

export const RATU_ASSETS = {
  shell: {
    fullAppBackground: asset("ImagemGeral/add8cb03-c912-48ea-ab0b-1b6a483278a5.png"),
  },

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
    extraRat: asset("PACOTE_1_RATU_ASSETS_ATUALIZADO/image-removebg-preview%20%2832%29.png"),
  },

  rats: {
    right: asset("RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_direita_sem_fundo.png"),
    left: asset("RATOS_DIREITA_ESQUERDA_SEM_FUNDO/rato_esquerda_sem_fundo.png"),
  },

  // O ideal é você deixar esses arquivos com esses nomes.
  // Caso eles estejam em outra pasta, só muda o caminho aqui.
  emulators: {
    mgba: "./assets/images/emulators/mGBA.png",
    melonds: "./assets/images/emulators/melonDS.png",
    azahar: "./assets/images/emulators/Azahar.png",
    mupen64plus: "./assets/images/emulators/Mupen64.png",
    duckstation: "./assets/images/emulators/DuckStation.png",
    mesens: "./assets/images/emulators/Mesen-S.png",
    fceux: "./assets/images/emulators/FCEUX.png",
    ppsspp: "./assets/images/emulators/PPSSPP.png",
    dolphin: "./assets/images/emulators/Dolphin.png",
    default: asset("RATU_LOTE2_ORGANIZADO_SEM_FUNDO/assets_gerais/06_card_emulator_model.png"),
  },
};

export function getEmulatorImage(emulatorId) {
  return RATU_ASSETS.emulators[emulatorId] || RATU_ASSETS.emulators.default;
}

export function getGameCover(game) {
  // Capa personalizada do usuário ganha prioridade.
  if (game?.coverPath) return game.coverPath;

  // Sem capa personalizada, usa o sistema/emulador.
  return getEmulatorImage(game?.emulatorId || game?.system || "default");
}
