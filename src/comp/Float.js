import { useState, useRef, useEffect } from 'react';
import './stylesheets/subject.css'

export default function Float({calOverlap, placeSubject, sub, coord}){

    let subject = null;
    function getRef(element){
        if(element !== null){
            subject = element;
        }
    }
    
    useEffect(() => {
        
        subject.style.position = 'absolute';
        subject.style.left = coord.x - subject.offsetWidth / 2 + 'px';
        subject.style.top = coord.y - subject.offsetHeight / 2 + 'px';
        subject.style.zIndex = 1000;

        function onMouseMove(event) {
            event.preventDefault();
            moveAt(event.pageX, event.pageY);
            calOverlap(subject);
        }
    
        function moveAt(pageX, pageY) {
            subject.style.left = pageX - subject.offsetWidth / 2 + 'px';
            subject.style.top = pageY - subject.offsetHeight / 2 + 'px';
        }
    
        let onMouseUp = function() {
            placeSubject();
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    },[coord, calOverlap, placeSubject]);

    return (
        <div ref={getRef} className="subject">
            {sub}
        </div>
    );
}