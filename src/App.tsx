import { Key, useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from '@tauri-apps/api/event'
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
  const [InputList, SetInputList] = useState([]);
  const [OutputList, SetOutputList] = useState([]);
  const [Input, SetInput] = useState();

  type Payload = {
    message: string;
  };
  type ListPayload = {
    message: string[];
  };
  async function emitEvent() {
    await invoke('emit_event');
  }
  async function rename_all(list: string[], out: string[]) {
    const filteredItems = list.filter(item => item !== null);
    const outItems = out.filter(item => item !== null);
    console.log('send: ', filteredItems, outItems);
    const response = await invoke('rename_all', { payload: filteredItems, out: outItems });
    console.log('Response: ', response);
    return response;
  }
  async function process(list: string[]) {
    const filteredItems = list.filter(item => item !== null);
    const response = await invoke<ListPayload>('process', { payload: filteredItems });
    console.log('Response: ', response);
    return response;
  }


  const TestBackend = () => {
    useEffect(() => {
      async function startSerialEventListener() {
        await listen<Payload>('event-name', (event) => {
          console.log("Event triggered from rust!\nPayload: " + event.payload.message);
          if (event.event == 'open_dir') {
            const nextInputList = [...InputList, event.payload.message];
            SetInputList(nextInputList);
          }
        });
        await listen<Payload>('open_dir', (event) => {
          console.log("Event triggered from rust!\nPayload: " + event.payload.message);
          const filteredItems = event.payload.message.filter(item => {
            const cond1 = item !== null;
            const cond2 = item !== "";
            return cond1 && cond2;
          }
          );
          var nextInputList = [...InputList, ...filteredItems];
          // nextInputList = nextInputList.filter(item => item !== "");
          SetInputList(nextInputList);
        });
        await listen<ListPayload>('open_files', (event) => {
          console.log("Event triggered from rust!\nPayload: " + event.payload.message);
          const filteredItems = event.payload.message.filter(item => {
            const cond1 = item !== null;
            const cond2 = item !== "";
            return cond1 && cond2;
          }
          );
          var nextInputList = [...InputList, ...filteredItems];
          // nextInputList = nextInputList.filter(item => item !== "");
          SetInputList(nextInputList);
        });
      }
      return () => {
        startSerialEventListener();
      };
    }, []);

    return (
      <button title="Trigger Event" onClick={emitEvent} />
    );
  };

  // const unlisten = await listen('click', (event) => {
  // // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
  // // event.payload is the payload object
  //   if (event.event == 'open_dir') {
  //     const nextInputList = event.payload;
  //     SetInputList(nextInputList);
  //   }
  // })
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
        <div id="button-pane">
          <button id="process-btn" className="process-button" type="button"
            onClick={async (e) => {
              e.preventDefault();
              console.log('submit !');
              if (InputList.length == 0) {
                return;
              }
              if (OutputList.length == 0) {
                return;
              }
              // var nextOutputList = [...InputList];
              // SetOutputList(nextOutputList);
              try {
                await rename_all(InputList, OutputList);
                // console.log(nextOutputList)
                // SetOutputList(nextOutputList);
              } catch (e) {
                return;
              }
            }}
          >➡️</button>
          <button id="process-btn" className="process-button" type="button"
            onClick={async (e) => {
              e.preventDefault();
              console.log('submit !');
              if (InputList.length == 0) {
                return;
              }
              // var nextOutputList = [...InputList];
              // SetOutputList(nextOutputList);
              try {
                var nextOutputList = await process(InputList);
                console.log(nextOutputList)
                SetOutputList(nextOutputList);
              } catch (e) {
                return;
              }
            }}
          >↓</button>
        </div>
        <div id="output-column" className="content-pane">
          <List id={"output-list"} items={OutputList} />
        </div>
      </div>
      <TestBackend />

    </div>
  );
}

export default App;
