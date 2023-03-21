import { useState, useRef, useEffect } from 'react';
import './stylesheets/block.css'
import Subject from './Subject';

export default function Blocke({helpers, sub, blockId}){
    
    const[active, setActive] = useState(false);
    let block = null;

    function getRef(element){
        block = element;
    }
    
    useEffect(() => {
        const obj = {
            elem: block,
            setState: setActive,
            isActive: false,
            id: blockId,
            subject: sub
        };
        helpers.addBlock(blockId, obj);
    });

    if(sub === ""){
        return (
            <div ref={getRef} className={active ? "highlight" : "block"}></div>
        );
    } else {
        return (
            <div ref={getRef} className="block">
                <Subject helpers={helpers} sub={sub} blockId={blockId}/>
            </div>
        );
    }
}