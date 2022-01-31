import './App.css';
import { useState, useEffect } from 'react';
import { useMachine } from "@xstate/react";
import { createMachine } from 'xstate';


const searchMachine = createMachine({
  id: 'search',
  initial: 'active',
  context: {
    canSearch: null,
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
          target: 'searching',
          cond: 'searchValid'
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
        },
        SEARCH: {
          target: 'searching'
        },
      }
    }
  },
},
{
  guards: {
    searchValid: (context, event) => {
      return event.query.length ? true : alert('This is not a valid search value')
    }
  }
}
)

function App() {
  const [state, send] = useMachine(searchMachine);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');



  const getRenderedComponent = (state) => {
    switch (state.value) {
      case 'disabled': {
        return (
            <button id="search" disabled>#</button>
          )
      }
      case 'active': {
          return (
            <button id="search" onClick={(e) => { 
              setSearchTerm(inputValue);
              send("SEARCH", {query: inputValue})
            }}> Search </button>
        )
      }
      case 'searching': {
        setTimeout(() => {send("RESULT");}, 3000);
        return (
            <button className="searchButton">Spinner</button>
        )
      }
      case 'reset': {
          return (
            <>
            <button id='clear' onClick={() => {
              send("CLEAR");
              setInputValue('');
              setSearchTerm('');
              }}>x</button>
            <button  id="search" onClick={(e) => { if (inputValue) {
              setSearchTerm(inputValue);
              send("SEARCH")
            }}} >Search</button>
            <p> SearchTerm: {searchTerm}</p>
            </>
      );
      }
      default: {
      return ( 
            <button id="search" onClick={(e) => { if (inputValue) {
              setSearchTerm(inputValue);
              send("SEARCH")
            }}}> Search </button>
        )
      
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
      <div>
      <input type="text" value={inputValue} name="name" onChange={(e) => setInputValue(e.target.value)} required size="20"/>
      {getRenderedComponent(state)}
      </div>
    </div>
  )
}

export default App;


// disabled = timer goes off => active => doSearch => searchState => resetState => activeState || searchState// DOI lookup
// disabled = timer goes off => active => doSearch => resetState // search
