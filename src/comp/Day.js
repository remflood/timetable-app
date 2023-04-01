import { useEffect, useState } from "react";
import Slot from "./Slot";
import './stylesheets/day.css'

export default function Day({arr, func, dayIndex, day}){

    let slots = [];
    const blocksPerSlot = day.getBlocksPerSlot();
    const numberofSlots = day.getNumberOfSlots();


    for(let i = 0; i < numberofSlots; i++){
        slots.push(<Slot startIndex={(blocksPerSlot)*i} array={arr.slice(i*(blocksPerSlot),(blocksPerSlot)*(i+1))} 
            func={func} day={dayIndex} blocksPerSlot={blocksPerSlot}/>);
    }

    function onMouseDown(e){
        e.preventDefault();
        func.openSlotMenu(dayIndex);
    }


    useEffect(() => {
        const elem = document.getElementById("d"+dayIndex);
        if(elem !== null){
            elem.addEventListener('mousedown',onMouseDown);
        }

        return () => {
            elem.addEventListener('mousedown',onMouseDown);
        }
    });
    
    return (
        <div id={dayIndex}  className="day">
            <div id={"d"+dayIndex} className="name">{day.getName()}</div>
            {slots}
        </div>
    );

}