import { useState, useRef, useEffect } from 'react';
import './App.css';
import Slot from './comp/Slot';
import Float from './comp/Float';

function App() {

  return (
    <div className="App">
      <Slot/>
      {/* <Float/> */}
    </div>
  );
}

export default App;
