import { Key, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

function List({ id, items }) {
  const filteredItems = items.filter(item => item !== null);

  // Check if the items array is not empty
  if (filteredItems.length === 0) {
    return null; // If empty, don't render anything
  }

  // If not empty, render the list
  return (
    <ul id={id}>
      {filteredItems.map((item: string, index: Key | null) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
// function List(id: any, list: any[]) {
//   if(list.)
//   const listItems = list.map(el => <li>{el}</li>);
//   return <ul id={id}>{listItems}</ul>;
// }

function App() {
  const [InputList, SetInputList] = useState([""]);
  const [OutputList, SetOutputList] = useState([""]);
  const [Input, SetInput] = useState("");

  return (
    <div className="container">
      <h1>Welcome to RustyShow!</h1>
      <form
        className="row"
        id="InputForm"
        onSubmit={(e) => {
          e.preventDefault();
          console.log('submit !');
          if (Input == "") {
            return;
          }
          var nextInputList = [...InputList, Input];
          // nextInputList = [...nextInputList, Input];
          SetInputList(nextInputList);
          SetInput("");
        }}
      >
        <input
          id="input-input"
          onChange={(e) => SetInput(e.currentTarget.value)}
          value={Input}
          placeholder="Enter an Input..."
        />
        <button type="submit">Add</button>
      </form>

      <div id="content" className="main-pane">
        <div id="input-column" className="content-pane">
          <List id={"input-list"} items={InputList} />
        </div>
        <button id="process-btn" className="process-button" type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('submit !');
            if (InputList.length == 0) {
              return;
            }
            var nextOutputList = [...InputList];
            SetOutputList(nextOutputList);
          }}
        >➡️</button>
        <div id="output-column" className="content-pane">
          <List id={"output-list"} items={OutputList} />
        </div>
      </div>

    </div>
  );
}

export default App;
