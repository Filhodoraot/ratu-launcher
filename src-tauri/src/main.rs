use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

fn get_ratu_root() -> Result<PathBuf, String> {
    let user_profile = std::env::var("USERPROFILE")
        .map_err(|_| "Não consegui achar a pasta do usuário no Windows.".to_string())?;

    Ok(PathBuf::from(user_profile)
        .join("Documents")
        .join("Ratu Launcher"))
}

fn emulator_ids() -> Vec<&'static str> {
    vec![
        "mgba",
        "melonds",
        "azahar",
        "mupen64plus",
        "duckstation",
        "snes9x",
        "nestopia",
        "ppsspp",
        "dolphin",
    ]
}

fn ensure_ratu_folders() -> Result<PathBuf, String> {
    let root = get_ratu_root()?;

    let mut folders = vec![
        root.clone(),
        root.join("games"),
        root.join("folders"),
        root.join("images"),
        root.join("images").join("consoles"),
        root.join("images").join("custom-covers"),
        root.join("saves"),
        root.join("emulators"),
        root.join("settings"),
        root.join("temp"),
    ];

    for emulator_id in emulator_ids() {
        folders.push(root.join("emulators").join(emulator_id));
    }

    for folder in folders {
        fs::create_dir_all(&folder)
            .map_err(|error| format!("Erro ao criar pasta {:?}: {}", folder, error))?;
    }

    Ok(root)
}

fn path_to_string(path: PathBuf) -> String {
    path.to_string_lossy().to_string()
}

fn settings_file(file_name: &str) -> Result<PathBuf, String> {
    let root = ensure_ratu_folders()?;
    Ok(root.join("settings").join(file_name))
}

fn read_or_default(path: PathBuf, default_value: &str) -> Result<String, String> {
    if !path.exists() {
        fs::write(&path, default_value)
            .map_err(|error| format!("Erro ao criar arquivo {:?}: {}", path, error))?;
    }

    fs::read_to_string(&path)
        .map_err(|error| format!("Erro ao ler arquivo {:?}: {}", path, error))
}

fn candidate_exe_names(emulator_id: &str) -> Vec<&'static str> {
    match emulator_id {
        "mgba" => vec![
            "mgba.exe",
            "mGBA.exe",
        ],
        "melonds" => vec![
            "melonDS.exe",
            "melonds.exe",
        ],
        "azahar" => vec![
            "azahar.exe",
            "azahar-qt.exe",
            "citra-qt.exe",
            "citra.exe",
        ],
        "mupen64plus" => vec![
            "mupen64.exe",
            "Mupen64.exe",
            "mupen64plus-gui.exe",
            "mupen64plus-qt.exe",
            "mupen64plus.exe",
        ],
        "duckstation" => vec![
            "DuckStation.exe",
            "duckstation.exe",
            "duckstation-qt.exe",
        ],
        "snes9x" => vec![
            "Mesen-S.exe",
            "mesen-s.exe",
            "Mesen.exe",
            "mesen.exe",
            "snes9x.exe",
            "Snes9x.exe",
        ],
        "nestopia" => vec![
            "fceux.exe",
            "FCEUX.exe",
            "nestopia.exe",
            "Nestopia.exe",
        ],
        "ppsspp" => vec![
            "PPSSPPWindows64.exe",
            "PPSSPPWindows.exe",
            "PPSSPP.exe",
            "ppsspp.exe",
        ],
        "dolphin" => vec![
            "Dolphin.exe",
            "dolphin.exe",
            "DolphinQt2.exe",
            "DolphinQt.exe",
        ],
        _ => vec![],
    }
}

fn find_named_exe_in_folder(folder: &Path, names: &[&str], depth: usize) -> Option<PathBuf> {
    if depth == 0 || !folder.exists() || !folder.is_dir() {
        return None;
    }

    let entries = fs::read_dir(folder).ok()?;

    for entry in entries.flatten() {
        let path = entry.path();

        if path.is_file() {
            let file_name = path.file_name()?.to_string_lossy().to_lowercase();

            for candidate in names {
                if file_name == candidate.to_lowercase() {
                    return Some(path);
                }
            }
        }
    }

    let entries = fs::read_dir(folder).ok()?;

    for entry in entries.flatten() {
        let path = entry.path();

        if path.is_dir() {
            if let Some(found) = find_named_exe_in_folder(&path, names, depth - 1) {
                return Some(found);
            }
        }
    }

    None
}

fn find_any_exe_in_folder(folder: &Path, depth: usize) -> Option<PathBuf> {
    if depth == 0 || !folder.exists() || !folder.is_dir() {
        return None;
    }

    let entries = fs::read_dir(folder).ok()?;

    for entry in entries.flatten() {
        let path = entry.path();

        if path.is_file() {
            let extension = path.extension()?.to_string_lossy().to_lowercase();

            if extension == "exe" {
                return Some(path);
            }
        }
    }

    let entries = fs::read_dir(folder).ok()?;

    for entry in entries.flatten() {
        let path = entry.path();

        if path.is_dir() {
            if let Some(found) = find_any_exe_in_folder(&path, depth - 1) {
                return Some(found);
            }
        }
    }

    None
}

fn is_path_inside(child: &Path, parent: &Path) -> bool {
    let child_canon = child.canonicalize();
    let parent_canon = parent.canonicalize();

    if child_canon.is_err() || parent_canon.is_err() {
        return false;
    }

    child_canon.unwrap().starts_with(parent_canon.unwrap())
}

fn common_search_folders(emulator_id: &str) -> Vec<PathBuf> {
    let mut folders = Vec::new();

    if let Ok(root) = get_ratu_root() {
        folders.push(root.join("emulators").join(emulator_id));
    }

    if let Ok(program_files) = std::env::var("ProgramFiles") {
        folders.push(PathBuf::from(program_files));
    }

    if let Ok(program_files_x86) = std::env::var("ProgramFiles(x86)") {
        folders.push(PathBuf::from(program_files_x86));
    }

    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
        folders.push(PathBuf::from(local_app_data));
    }

    folders
}

fn find_exe_in_common_places(emulator_id: &str) -> Option<PathBuf> {
    let names = candidate_exe_names(emulator_id);

    for folder in common_search_folders(emulator_id) {
        if let Some(found) = find_named_exe_in_folder(&folder, &names, 6) {
            return Some(found);
        }
    }

    None
}

#[tauri::command]
fn ensure_ratu_data_folder() -> Result<String, String> {
    let root = ensure_ratu_folders()?;
    Ok(path_to_string(root))
}

#[tauri::command]
fn get_emulator_default_folder(emulator_id: String) -> Result<String, String> {
    let root = ensure_ratu_folders()?;
    Ok(path_to_string(root.join("emulators").join(emulator_id)))
}

#[tauri::command]
fn open_url(url: String) -> Result<String, String> {
    if url.trim().is_empty() {
        return Err("URL vazia.".to_string());
    }

    Command::new("cmd")
        .args(["/C", "start", "", &url])
        .spawn()
        .map_err(|error| format!("Erro ao abrir link: {}", error))?;

    Ok("Página de instalação aberta.".to_string())
}

#[tauri::command]
fn install_emulator_winget(winget_id: String) -> Result<String, String> {
    if winget_id.trim().is_empty() {
        return Err("Esse emulador ainda não tem instalação automática por winget.".to_string());
    }

    let status = Command::new("cmd")
        .args([
            "/C",
            "winget",
            "install",
            "-e",
            "--id",
            &winget_id,
            "--accept-package-agreements",
            "--accept-source-agreements",
        ])
        .status()
        .map_err(|error| format!("Erro ao iniciar winget: {}", error))?;

    if !status.success() {
        return Err("O winget não conseguiu instalar esse emulador.".to_string());
    }

    Ok("Instalação pelo winget finalizada.".to_string())
}

#[tauri::command]
fn uninstall_emulator_winget(winget_id: String) -> Result<String, String> {
    if winget_id.trim().is_empty() {
        return Err("Esse emulador não tem ID do winget salvo.".to_string());
    }

    let status = Command::new("cmd")
        .args([
            "/C",
            "winget",
            "uninstall",
            "-e",
            "--id",
            &winget_id,
        ])
        .status()
        .map_err(|error| format!("Erro ao iniciar winget uninstall: {}", error))?;

    if !status.success() {
        return Err("O winget não conseguiu desinstalar esse emulador.".to_string());
    }

    Ok("Emulador desinstalado pelo winget.".to_string())
}

#[tauri::command]
fn detect_emulator_exe(emulator_id: String) -> Result<String, String> {
    if let Some(found) = find_exe_in_common_places(&emulator_id) {
        return Ok(path_to_string(found));
    }

    Err("Não achei o .exe instalado automaticamente.".to_string())
}

#[tauri::command]
fn find_emulator_exe(emulator_id: String, folder_path: String) -> Result<String, String> {
    let folder = PathBuf::from(&folder_path);

    if !folder.exists() {
        return Err(format!("Pasta não encontrada: {}", folder_path));
    }

    if !folder.is_dir() {
        return Err(format!("Isso não é uma pasta: {}", folder_path));
    }

    let candidates = candidate_exe_names(&emulator_id);

    if let Some(found) = find_named_exe_in_folder(&folder, &candidates, 5) {
        return Ok(path_to_string(found));
    }

    if let Some(found) = find_any_exe_in_folder(&folder, 5) {
        return Ok(path_to_string(found));
    }

    Err("Não achei nenhum .exe dentro dessa pasta.".to_string())
}

#[tauri::command]
fn uninstall_emulator(
    emulator_id: String,
    folder_path: String,
    exe_path: String,
) -> Result<String, String> {
    let root = ensure_ratu_folders()?;
    let emulators_root = root.join("emulators");
    let default_folder = emulators_root.join(&emulator_id);

    fs::create_dir_all(&default_folder)
        .map_err(|error| format!("Erro ao preparar pasta padrão: {}", error))?;

    let selected_folder = if !folder_path.trim().is_empty() {
        PathBuf::from(folder_path)
    } else if !exe_path.trim().is_empty() {
        let exe = PathBuf::from(exe_path);

        if let Some(parent) = exe.parent() {
            parent.to_path_buf()
        } else {
            default_folder.clone()
        }
    } else {
        default_folder.clone()
    };

    let can_delete_folder =
        selected_folder.exists()
        && selected_folder.is_dir()
        && is_path_inside(&selected_folder, &emulators_root);

    if can_delete_folder {
        fs::remove_dir_all(&selected_folder)
            .map_err(|error| format!("Erro ao desinstalar emulador: {}", error))?;

        fs::create_dir_all(&default_folder)
            .map_err(|error| format!("Erro ao recriar pasta padrão: {}", error))?;

        return Ok("Emulador desinstalado da pasta do Ratu.".to_string());
    }

    Ok("Emulador desvinculado. Ele estava fora da pasta do Ratu, então não apaguei arquivos do PC.".to_string())
}

#[tauri::command]
fn create_game_folder(game_id: String) -> Result<String, String> {
    let root = ensure_ratu_folders()?;
    let game_folder = root.join("games").join(&game_id);

    let folders = [
        game_folder.clone(),
        game_folder.join("saves"),
        game_folder.join("screenshots"),
        game_folder.join("images"),
    ];

    for folder in folders {
        fs::create_dir_all(&folder)
            .map_err(|error| format!("Erro ao criar pasta do jogo {:?}: {}", folder, error))?;
    }

    Ok(path_to_string(game_folder))
}

#[tauri::command]
fn load_library_file() -> Result<String, String> {
    let path = settings_file("library.json")?;
    read_or_default(path, "[]")
}

#[tauri::command]
fn save_library_file(json: String) -> Result<String, String> {
    let path = settings_file("library.json")?;

    fs::write(&path, json)
        .map_err(|error| format!("Erro ao salvar library.json: {}", error))?;

    Ok("Biblioteca salva.".to_string())
}

#[tauri::command]
fn load_emulators_file() -> Result<String, String> {
    let path = settings_file("emulators.json")?;
    read_or_default(path, "[]")
}

#[tauri::command]
fn save_emulators_file(json: String) -> Result<String, String> {
    let path = settings_file("emulators.json")?;

    fs::write(&path, json)
        .map_err(|error| format!("Erro ao salvar emulators.json: {}", error))?;

    Ok("Emuladores salvos.".to_string())
}

#[tauri::command]
fn launch_game(emulator_path: String, rom_path: String) -> Result<String, String> {
    let emulator = PathBuf::from(&emulator_path);
    let rom = PathBuf::from(&rom_path);

    if !emulator.exists() {
        return Err(format!("Emulador não encontrado: {}", emulator_path));
    }

    if !rom.exists() {
        return Err(format!("ROM não encontrada: {}", rom_path));
    }

    Command::new(&emulator_path)
        .arg(&rom_path)
        .spawn()
        .map_err(|error| format!("Erro ao abrir o jogo: {}", error))?;

    Ok("Jogo aberto pelo Ratu Launcher.".to_string())
}

#[tauri::command]
fn launch_test_notepad() -> Result<String, String> {
    Command::new("notepad")
        .spawn()
        .map_err(|error| format!("Erro ao abrir o Notepad: {}", error))?;

    Ok("Notepad aberto pelo Ratu Launcher.".to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            ensure_ratu_data_folder,
            get_emulator_default_folder,
            open_url,
            install_emulator_winget,
            uninstall_emulator_winget,
            detect_emulator_exe,
            find_emulator_exe,
            uninstall_emulator,
            create_game_folder,
            load_library_file,
            save_library_file,
            load_emulators_file,
            save_emulators_file,
            launch_game,
            launch_test_notepad
        ])
        .run(tauri::generate_context!())
        .expect("erro ao rodar o Ratu Launcher");
}