import './App.css';
import { useMachine } from "@xstate/react";
import { createMachine } from 'xstate';

// we need:
// show all the different states for searching: ready, loading and reset
// state diagrams and user flows

const searchMachine = createMachine({
  id: 'search',
  initial: 'disabled',
  context: {
    search: null,
  },
  states: {
    ready: {},
    searching: {},
    reset: {}
  },
  on: {
    SEARCH: {
      target: '.searching',
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
  const search = state.matches("active");
  const { searchValue } = state.context;
  return (
    <div className="App">
      <input type="text" id="name" name="name" value={searchValue} required size="20"></input>
      <button onClick={() => send("SEARCH", { name: e.target.value })}> Search </button>
    </div>
  );
}

export default App;
