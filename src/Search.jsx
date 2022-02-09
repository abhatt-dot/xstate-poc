import React, {useState, useEffect} from 'react';
import { useMachine } from "@xstate/react";
import searchMachine from './search-machine';

const Search = ({isSyncing}) => {
    const [state, send] = useMachine(searchMachine);
    const [inputValue, setInputValue] = useState('');
    const { canSearch, searchTerm } = state.context;

    useEffect(() => {
        if (isSyncing) {
            send("SYNC", { searchEnabled: false});
        } else {
            send("ACTIVATE", {searchEnabled: true});
        }
    }, [send, isSyncing])


    const getRenderedComponent = (state) => {
        switch (state.value) {
          case 'disabled': {
            return (
                <button id="search" disabled={!canSearch} >#</button>
              )
          }
          case 'searching': {
            setTimeout(() => {send("RESULT");}, 1500);
            return (
              <button className="buttonload">
                <i className="fa fa-spinner fa-spin"></i>Loading
              </button>
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

    return(
        <div>
            <h1>Search</h1>
            <input type="text" value={inputValue} name="name" onChange={(e) => setInputValue(e.target.value)} disabled={!canSearch} required size="20"/>
            {getRenderedComponent(state)}
            {isSyncing && <p>Syncing....</p>}
        </div>
    );
}

export default Search;