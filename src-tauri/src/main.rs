// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn add_input(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let open_file = CustomMenuItem::new("open_file".to_string(), "Open File...");
    let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(open_file));
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu);
    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
              "quit" => {
                std::process::exit(0);
              }
              "open_file" => {
                event.window().emit("open_file", Payload { message: "msg".to_string() }).unwrap();
              }
              _ => {}
            }
          })
        .invoke_handler(tauri::generate_handler![add_input])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
