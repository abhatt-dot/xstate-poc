import './App.css';
import { useState, useEffect } from 'react';
import Search from './Search';


function App() {
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsSyncing(true);
    }, 8000);
    return () => clearInterval(intervalId);
    
  }, [])


  useEffect(() => {
    setTimeout(() => {setIsSyncing(false)}, 2000);
  }, [isSyncing])
  

  return (
    <div className='App'>
      <Search isSyncing={isSyncing}/>
    </div>
  )
}

export default App;
