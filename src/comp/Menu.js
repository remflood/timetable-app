import { useEffect, useState } from "react";
import './stylesheets/menu.css'

export default function Menu({pos, subjects, func, showRemove = false}){
    
    const divStyle = {
        top: pos.y + "px",
        left: pos.x + "px" 
    };

    function onMouseDown(event){
        func.selectSubject(event.target.innerHTML);
    }

    function removeSubject(event){
        func.removeSubject();
        console.log("Remove Subject");
    }

    useEffect(() => {

        const collection = document.getElementsByClassName("sub");
        const removeElem = document.getElementById("menuRemove");
        
        if(removeElem !== null){
            removeElem.addEventListener('mousedown', removeSubject);
        }

        for(let element of collection){
            element.addEventListener('mousedown',onMouseDown);
        }

        return () => {
            for(let element of collection){
                element.removeEventListener('mousedown',onMouseDown);
            }
            if(removeElem !== null){
                removeElem.removeEventListener('mousedown', removeSubject);
            }
        };

    });

    return (
        <div className="menu">
            {showRemove ? <div id="menuRemove" style={divStyle}>Remove</div> : null}
            {subjects.map(subject => {
                return <div className="sub" style={divStyle}>{subject}</div>;
            })}
        </div>
    );

}