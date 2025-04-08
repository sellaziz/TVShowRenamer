// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, env};
use std::path::{PathBuf};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Config {
    api_key: String,
    rename_format: String,
}

fn get_config_path() -> PathBuf {
    // Get the current working directory and append "config.json"
    let current_dir = env::current_dir().expect("Failed to get current directory");
    current_dir.join("config.json")
}

fn load_config() -> Config {
    let config_path = get_config_path();

    // Check if the config file exists
    if !config_path.exists() {
        // If it doesn't exist, create a default config file
        let default_config = Config {
            api_key: "".to_string(),
            rename_format: "default".to_string(),
        };
        let content = serde_json::to_string(&default_config).unwrap();
        fs::write(&config_path, content).unwrap();
        return default_config;
    }

    // Read and parse the config file
    let content = fs::read_to_string(&config_path).unwrap_or_else(|_| "{}".to_string());
    serde_json::from_str(&content).unwrap_or_else(|_| Config {
        api_key: "".to_string(),
        rename_format: "default".to_string(),
    })
}

#[tauri::command]
fn set_api_key(api_key: String) {
    let mut config = load_config();
    config.api_key = api_key;
    let content = serde_json::to_string(&config).unwrap();
    fs::write(get_config_path(), content).unwrap();
}

#[tauri::command]
fn rename_file(
    original_path: String,
    new_name: String,
    output_directory: String,
) -> Result<(), String> {
    let new_path: PathBuf;
    let original_path = PathBuf::from(original_path);
    let parent = original_path
        .parent()
        .ok_or("Failed to get parent directory")?;
    if (output_directory).is_empty() {
        new_path = parent.join(new_name);
    } else {
        if !PathBuf::from(output_directory.clone()).exists() {
            fs::create_dir_all(output_directory.clone()).map_err(|e| e.to_string())?;
        }
        new_path = PathBuf::from(output_directory.clone()).join(new_name);
    }
    fs::rename(original_path, new_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_api_key() -> String {
    load_config().api_key
}

#[tauri::command]
fn get_rename_format() -> String {
    load_config().rename_format
}

#[tauri::command]
fn set_rename_format(format: String) {
    let mut config = load_config();
    config.rename_format = format;
    let content = serde_json::to_string(&config).unwrap();
    fs::write(get_config_path(), content).unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            rename_file,
            get_api_key,
            set_api_key,
            get_rename_format,
            set_rename_format
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
