import { useState, useRef, useEffect } from 'react';
import './stylesheets/block.css'

export default function Block({func, sub, blockId, day}){
    
    const[active, setActive] = useState(false);

    let block = null;

    function getRef(element){
        if(element !== null){
            block = element;
        }
    }

    function onMouseDown(event){
        if(event.buttons === 1){
            if(block !== null)
                block.removeEventListener('mousedown',onMouseDown);
            func.createFloat(sub, day, blockId, {x: event.pageX, y: event.pageY});
        } else if(event.buttons === 2){
            func.openSubjectMenu({x: event.pageX, y: event.pageY}, day, blockId, true)
        }
        
    }

    function openMenu(event){
        if(event.buttons === 2)
            func.openSubjectMenu({x: event.pageX, y: event.pageY}, day, blockId, false)
    }

    useEffect(() => {
        const obj = {
            id: blockId,
            subject: sub,
            elem: block,
            isActive: active,
            setState: setActive,
        };
        func.addBlock(blockId, obj, day);

        if(block !== null){
            if(sub !== ""){
                block.addEventListener('mousedown',onMouseDown);
            } else {
                block.addEventListener('mousedown',openMenu);
            }
        }

        return () => {
            block.removeEventListener('mousedown',onMouseDown);
            block.removeEventListener('mousedown',openMenu);
        }
    });

    return (
        <div ref={getRef} className={active ? "block highlight" : "block"}>
            {sub}
        </div>
    );

}