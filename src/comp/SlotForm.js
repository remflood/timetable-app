import { useState, useRef, useEffect } from 'react';
import './stylesheets/slotform.css'


export default function SlotForm({func, data}){

    const [slotValue, setSlotValue] = useState(data.slotValue);


    function add(){
        let initialValue = slotValue;
        initialValue++;
        setSlotValue(initialValue);
    }

    function subtract(){
        let initialValue = slotValue;
        if(initialValue > 3){
            initialValue--;
            setSlotValue(initialValue);
        }
    }
    
    function save(){
        func.updateSlotValue(data.dayIndex, slotValue);
    }

    useEffect(() => {
        
    });
    
    return (
        <div className="slotform">
            <h3>Number of Slots for Day</h3>
            <div className='container'>
                <button onClick={subtract}>-</button>
                <div>{slotValue}</div>
                <button onClick={add}>+</button>
            </div>
            <div className='container'>
                <button onClick={save}>Save</button>
            </div>
        </div>
    );
    
}