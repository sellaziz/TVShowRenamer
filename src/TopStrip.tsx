import "./styles.css";

function TopStrip() {
  return  (
    <div className="top-strip">
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
      </a>
    </div>
  )
}

export default TopStrip;
