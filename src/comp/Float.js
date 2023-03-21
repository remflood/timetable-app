import { useState, useRef, useEffect } from 'react';
import './stylesheets/subject.css'

export default function Float({helpers, sub, coord}){

    let subject = null;
    function getRef(element){
        subject = element;
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        helpers.compare(subject,{x: event.pageX, y: event.pageY});
    }

    function moveAt(pageX, pageY) {
        subject.style.left = pageX - subject.offsetWidth / 2 + 'px';
        subject.style.top = pageY - subject.offsetHeight / 2 + 'px';
    }

    let onMouseUp = function() {
        helpers.placeSubject();
    };
    
    useEffect(() => {
        if(subject !== null){
            console.log("Check");
            subject.style.position = 'absolute';
            subject.style.left = coord.x - subject.offsetWidth / 2 + 'px';
            subject.style.top = coord.y - subject.offsetHeight / 2 + 'px';
            subject.style.zIndex = 1000;
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', onMouseMove);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    });

    return (
        <div ref={getRef} className="subject">
            {sub}
        </div>
    );
}