import './App.css';
import { useMachine } from "@xstate/react";
import { assign, createMachine } from 'xstate';

// we need:
// show all the different states for searching: ready, loading and reset
// state diagrams and user flows

const searchMachine = createMachine({
  // id: 'search',
  initial: 'disabled',
  context: {
    search: null,
  },
  states: {
    disabled: {},
    searching: {},
    reset: {}
  },
  on: {
    SEARCH: {
      target: 'searching',
      actions: assign({ search: (e) => e.search })
      // when you search change the button to green + persist a search term
    },
    RESET: {
      // when you click the button it shows reset button
      // and clears the search
    },
    
  }
})

function App() {
  const [state, send] = useMachine(searchMachine);
  // const search = state.matches("disabled");
  const { search } = state.context;
  console.log(search);
  let inputValue;

  return (
    <div className="App">
      <input type="text" name="name"  onChange={(e) => inputValue = e.target.value}required size="20"></input>
      <button id="search" onClick={(e) => send("SEARCH", { search: inputValue })}> {state.matches("disabled") ? "hello" : search} </button>
    </div>
  );
}

export default App;
