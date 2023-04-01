import { useState } from "react";

export default function TestChild({prop}){


    const [render, setRender] = useState(prop);
    document.body.addEventListener('mouseup',onMouseUp);

    function onMouseUp(){
        setRender("From the inside");
        console.log("On mouse up called");
    }

    return (
        <p>{render}</p>
    );
}