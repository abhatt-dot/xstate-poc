import './App.css';
import { useState, useEffect } from 'react';
import { useMachine } from "@xstate/react";
import { createMachine } from 'xstate';


const searchMachine = createMachine({
  id: 'search',
  initial: 'active',
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
        },
        SYNC: {
          target: 'disabled'
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
  const [searchTerm, setSearchTerm] = useState('');

  const getRenderedComponent = (state) => {
    switch (state.value) {
      case 'disabled': {
        return (<div>
            <input type="text" name="name" size="20" disabled></input>
            <button id="search" disabled>#</button>
          </div>)
      }
      case 'active': {
          return (<div>
            <input type="text" value={inputValue} name="name"  onChange={(e) => setInputValue(e.target.value)}required size="20"></input>
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
            <input type="text" value={inputValue} name="name"  onChange={(e) => setSearchTerm(e.target.value)}required size="20"></input>
            <button className="searchButton">Spinner</button>
          </div>
        )
      }
      case 'reset': {
          return (<div>
            <input type="text" value={inputValue} name="name"  onChange={(e) => setSearchTerm(e.target.value)}required size="20"></input>
            <button id='clear' onClick={() => {
              send("CLEAR");
              setInputValue('');
              setSearchTerm('');
              }}>x</button>
            <button  id="search" disabled>Search</button>
            <p> SearchTerm: {searchTerm}</p>
          </div>);
      }
      default: {
      return ( <div>
            <input type="text" value={inputValue} name="name"  onChange={(e) => setInputValue(e.target.value)}required size="20"></input>
            <button id="search" onClick={(e) => { if (inputValue) {
              setSearchTerm(inputValue);
              send("SEARCH")
            }}}> Search </button>
          </div>)
      
      }
    }
  }

  return (
    <div className='App'>
      <button onClick={() => {
        send("SYNC");
        setTimeout(() => {
          send("ACTIVATE")
        }, 2000);
      }}>Sync</button>
      {getRenderedComponent(state)}
    </div>
  )


}

export default App;


// disabled = timer goes off => active => doSearch => searchState => resetState => activeState || searchState// DOI lookup
// disabled = timer goes off => active => doSearch => resetState // search
