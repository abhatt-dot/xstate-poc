import './App.css';
import { useState } from 'react';
import { useMachine } from "@xstate/react";
import { createMachine, assign } from 'xstate';


const searchMachine = createMachine({
  id: 'search',
  initial: 'default',
  context: {
    canSearch: true,
    searchTerm: null,
  },
  states: {
    disabled: {
      on: {
        ACTIVATE: {
          target: 'default',
          actions: assign({
            canSearch: (context, event) => event.searchEnabled
          }),
        }
      }
    },
    default: {
      on: {
        SEARCH: {
          target: 'searching',
          actions: assign({
            searchTerm: (_, event) => event.query
          }),
          cond: 'searchValid'
        },
        SYNC: {
          target: 'disabled',
          actions: assign({
            canSearch: (_, event) => event.searchEnabled
          }),
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
          target: 'default'
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
    searchValid: (_, event) => event.query.length > 0 ? true : alert('This is not a valid search value'),
  }
}
)

function App() {
  const [state, send] = useMachine(searchMachine);
  const [inputValue, setInputValue] = useState('');
  const { canSearch, searchTerm } = state.context;

  setInterval(() => {
    send("SYNC", { searchEnabled: false} );
    setTimeout(() => {
      send("ACTIVATE", {searchEnabled: true})}, 1000);
  }, 10000);

  const getRenderedComponent = (state) => {
    switch (state.value) {
      case 'disabled': {
        return (
            <button id="search" disabled={!canSearch} >#</button>
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
              send("CLEAR", {query: inputValue});
              setInputValue('');
              }}>x</button>
            <button  id="search" onClick={() => {
              send("SEARCH", {query: inputValue})
            }} >Search</button>
            <p> SearchTerm: {searchTerm}</p>
            </>
      );
      }
      default: {
      return ( 
            <button id="search" onClick={() => {
              send("SEARCH", {query: inputValue})
            }}> Search </button>
        )
      }
    }
  }



  return (
    <div className='App'>
      <input type="text" value={inputValue} name="name" onChange={(e) => setInputValue(e.target.value)} disabled={!canSearch} required size="20"/>
      {getRenderedComponent(state)}
    </div>
  )
}

export default App;
