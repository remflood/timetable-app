import { useState, useRef, useEffect } from 'react';
import './stylesheets/subject.css'

export default function Subject({helpers, sub, blockId}){

    let subject = null;
    
    function getRef(element){
        if(element !== null){
            subject = element;
        }
    }

    function onMouseDown(event){
        if(subject !== null)
            subject.removeEventListener('mousedown',onMouseDown);
        helpers.moveSubject(sub, blockId, {x: event.pageX, y: event.pageY});
    }

    useEffect(() => {
        if(subject !== null){
            subject.addEventListener('mousedown',onMouseDown);
        }

        return () => {
            subject.removeEventListener('mousedown',onMouseDown);
        }
    });
    
    return (
        <div ref={getRef} className="subject">
            {sub}
        </div>
    );
}