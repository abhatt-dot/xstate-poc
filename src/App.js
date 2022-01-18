import './App.css';
import { useState, useEffect } from 'react';
import { useMachine } from "@xstate/react";
import { assign, createMachine } from 'xstate';

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
    disabled: {
      on: {
        ACTIVATE: {
          target: 'active'
        }
      }
    },
    active: {
      on: {
        SEARCH: {
          target: 'searching'
        }
      }
    },
    searching: {
      on: {
        RESULT: { 
          target: 'reset'
        }
      }
    },
    reset: {
      on: {
        CLEAR: {
          target: 'active'
        }
      }
    }
  },
})

function App() {
  const [state, send] = useMachine(searchMachine);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState(null);
  console.log(state);
  let isActive = false;
  setTimeout(() => {
    isActive = true;
  }, 2000);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {send('ACTIVATE')}, [isActive])

  switch (state.value) {
    case 'disabled': {
      return (<div className="App">
          <input type="text" name="name" size="20" disabled></input>
          <button id="search" disabled>#</button>
        </div>)
    }
    case 'active': {
        return (<div className="App">
          <input type="text" name="name"  onChange={(e) => setInputValue(e.target.value)}required size="20"></input>
          <button id="search" onClick={(e) => { if (inputValue) {
            setSearchTerm(inputValue);
            send("SEARCH")
          }}}> Search </button>
        </div>)
    }
    case 'searching': {
      setTimeout(() => {send("RESULT");}, 3000);
      return (
        <div>
          <input type="text" name="name"  onChange={(e) => setSearchTerm(e.target.value)}required size="20"></input>
          <button>Spinner</button>
        </div>
      )
    }
    case 'reset': {
        return (<div className="App">
          <input type="text" name="name"  onChange={(e) => setSearchTerm(e.target.value)}required size="20"></input>
          <button id="search" disabled>Search</button>
          <button id='clear' onClick={() => send("CLEAR")}>x</button>
          <p> SearchTerm: {searchTerm}</p>
        </div>);
    }
    default: {
     return ( <div className="App">
          <input type="text" name="name"  onChange={(e) => setInputValue(e.target.value)}required size="20"></input>
          <button id="search" onClick={(e) => { if (inputValue) {
            setSearchTerm(inputValue);
            send("SEARCH")
          }}}> Search </button>
        </div>)
    
    }
  }


}

export default App;


// disabled = timer goes off => active => doSearch => searchState => resetState => activeState || searchState// DOI lookup
// disabled = timer goes off => active => doSearch => resetState // search
