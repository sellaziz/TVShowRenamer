// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

use tauri::api::dialog::FileDialogBuilder;
use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn add_input(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn emit_event(app: tauri::AppHandle) {
    let payload = Payload {
        message: "Tauri is awesome!".into(),
    };
    app.app_handle()
        .emit_all("event-name", Some(payload))
        .unwrap();
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let open_dir = CustomMenuItem::new("open_dir".to_string(), "Open Directory...");
    let open_files = CustomMenuItem::new("open_files".to_string(), "Open Files...");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_item(quit)
            .add_item(open_dir)
            .add_item(open_files),
    );
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu);
    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "open_dir" => {
                FileDialogBuilder::new().pick_folder(move |folder_path| {
                    if folder_path.is_none() {
                        return;
                    }
                    event
                        .window()
                        .app_handle()
                        .emit_all(
                            "open_dir",
                            Payload {
                                message: folder_path
                                    .unwrap()
                                    .into_os_string()
                                    .into_string()
                                    .unwrap()
                                    .into(),
                            },
                        )
                        .unwrap();
                });
            }
            "open_files" => {
                FileDialogBuilder::new().pick_files(move |files_path| {
                    if files_path.is_none() {
                        return;
                    }
                    let concatenated_paths = files_path.unwrap()
                        .iter()
                        .map(|path| <PathBuf as Clone>::clone(&path).into_os_string().into_string().unwrap())
                        .collect::<Vec<String>>()
                        .join("; "); // Use whatever separator you prefer

                    event
                        .window()
                        .app_handle()
                        .emit_all(
                            "open_files",
                            Payload {
                                message: concatenated_paths,
                            },
                        )
                        .unwrap();
                });
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![add_input, emit_event])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
