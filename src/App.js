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
            canSearch: (context, event) => event.query
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
            canSearch: (_, event) => event.query
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
      <button onClick={() => {
          send("SYNC", {query: false})
          setTimeout(() => {
            send("ACTIVATE", {query: true})
        }, 2000);
      }}>Sync</button>
      <div>
      <input type="text" value={inputValue} name="name" onChange={(e) => setInputValue(e.target.value)} disabled={!canSearch} required size="20"/>
      {getRenderedComponent(state)}
      </div>
    </div>
  )
}

export default App;


// disabled = timer goes off => active => doSearch => searchState => resetState => activeState || searchState// DOI lookup
// disabled = timer goes off => active => doSearch => resetState // search
