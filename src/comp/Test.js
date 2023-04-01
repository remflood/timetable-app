import TestChild from "./TestChild";

export default function Test(){

    let prop = "Para";
    document.body.addEventListener('mousedown',onMouseDown);

    function onMouseDown(e){
        prop = "Para updated";
        console.log("Para updated");
    }

    return(
        <div>
            <TestChild prop={prop}/>
        </div>
    )
}