const { invoke } = window.__TAURI__.tauri;
import { open } from '@tauri-apps/api/dialog';
import { emit, listen } from '@tauri-apps/api/event'

let inputInputEl;
let outputListEl;
let inputListEl;

async function add_input() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // inputMsgEl.textContent = await invoke("add_input", { name: inputInputEl.value });
  if (inputInputEl.value != "") {
    var li = document.createElement("li");
    var t = document.createTextNode(inputInputEl.value);
    li.appendChild(t);
    inputListEl.appendChild(li);
    inputInputEl.value = "";
  }
}

async function process_input() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  // inputMsgEl.textContent = await invoke("add_input", { name: inputInputEl.value });
  // outputListEl.innerHTML = ""
  // for (const child of inputListEl.children) {
  //   var li = document.createElement("li");
  //   var t = document.createTextNode(child.innerText);
  //   li.appendChild(t);
  //   outputListEl.appendChild(li);
  // }
  dialog.open({
    directory: false,
    multiple: false,
    filter: { 'All Files': ['*'] }
  })
    .then((result) => {
      console.log('Selected file:', result);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

window.addEventListener("DOMContentLoaded", () => {
  inputInputEl = document.querySelector("#input-input");
  inputListEl = document.querySelector("#input-list");
  outputListEl = document.querySelector("#output-list");
  document.querySelector("#input-form").addEventListener("submit", (e) => {
    e.preventDefault();
    add_input();
  });
  document.querySelector("#process-btn").onclick =
    function() {
      process_input();
    }
  ;
  // const unlisten = await listen('open_file', (event) => {
  //   // Open a selection dialog for directories
  // const selected = await open({
  //       directory: true,
  //       multiple: true,
  //       defaultPath: await appDir(),
  //     });
  //     if (Array.isArray(selected)) {
  //       // user selected multiple directories
  //     } else if (selected === null) {
  //       // user cancelled the selection
  //     } else {
  //       // user selected a single directory
  //     };
  // });
  // document.querySelector("#content").addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   process_input();
  // });
});
