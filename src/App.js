import { useState, useRef, useEffect } from 'react';
import './App.css';
import Block from './comp/Block';

function App() {

  const one = 1;
  const two = 2;
  
  let alreadyActive = false;

  let obj_1 = {
    id: 1,
    isActive: false
  }

  let obj_2 = {
    id: 2,
    isActive: false
  }

  let blockIdList = [obj_1];

  function order(id, isNear){

    let value = false;

    blockIdList.forEach(block => {
      if(block.id === id){
        if(isNear && !alreadyActive){
          block.isActive = true;
          alreadyActive = true;
          value = true;
        } else {
          if(block.isActive && !isNear){
            block.isActive = false;
            alreadyActive = false;
            value = true;
          }
        }
      } else {
        value = false;
      }
    });

    return value;
  }

  return (
    <div className="App">
      <Block id={one} func={order}/>
      <Block id={one} func={order}/>
      <Block id={one} func={order}/>
    </div>
  );
}

export default App;
