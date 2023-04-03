import { useState, useRef, useEffect } from 'react';
import './stylesheets/block.css'

export default function Block({block, func}){
    
    const[active, setActive] = useState(false);

    let blockElem = null;

    function getRef(element){
        if(element !== null){
            blockElem = element;
        }
    }

    function onMouseDown(event){

        func.createFloat(block, {x: event.pageX, y: event.pageY});
        blockElem.removeEventListener('mousedown',onMouseDown);
        // if(event.buttons === 1){
        //     if(block !== null)
        //         block.removeEventListener('mousedown',onMouseDown);
        //     func.createFloat(block, {x: event.pageX, y: event.pageY});
        // } else if(event.buttons === 2){
        //     func.openSubjectMenu({x: event.pageX, y: event.pageY}, day, blockId, true)
        // }
        
    }

    // function openMenu(event){
    //     if(event.buttons === 2)
    //         func.openSubjectMenu({x: event.pageX, y: event.pageY}, day, blockId, false)
    // }

    useEffect(() => {
        if(blockElem !== null)
            blockElem.addEventListener('mousedown',onMouseDown);
        // if(block !== null){
        //     if(sub !== ""){
        //         block.addEventListener('mousedown',onMouseDown);
        //     } else {
        //         block.addEventListener('mousedown',openMenu);
        //     }
        // }

        return () => {
            blockElem.removeEventListener('mousedown',onMouseDown);
        //     block.removeEventListener('mousedown',openMenu);
        }
    });

    return (
        <div ref={getRef} day={block.day} slot={block.slot} id={block.id} className={block.isHigh ? "block highlight" : "block"}>
            {block.subject}
        </div>
    );

}