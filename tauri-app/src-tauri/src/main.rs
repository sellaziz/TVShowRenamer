// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs};
use std::path::PathBuf;

#[tauri::command]
fn rename_file(original_path: String, new_name: String, output_directory: String) -> Result<(), String> {
    let new_path: PathBuf;
    let original_path = PathBuf::from(original_path);
    let parent = original_path.parent().ok_or("Failed to get parent directory")?;
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
  env::var("TMDB_API_KEY").expect("TMDBAPI_KEY must be set")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rename_file, get_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
