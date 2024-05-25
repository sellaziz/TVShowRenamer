// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn rename_file(original_path: String, new_name: String) -> Result<(), String> {
    let original_path = PathBuf::from(original_path);
    let parent = original_path.parent().ok_or("Failed to get parent directory")?;
    let new_path = parent.join(new_name);
    fs::rename(original_path, new_path).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rename_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
