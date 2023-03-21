import { useState, useRef, useEffect } from 'react';
import Blocke from './Blocke';
import Float from './Float';

export default function Slot(){
    const [subject, setSubject] = useState("");
    const [subjectArray, setSubjectArray] = useState(["Physics","Law","Chemistry","Math","Sociology"]);
    let prevSubjectArray = useRef(null); 
    
    let blocks = [];
    let coord = useRef(null);
    
    let arrayIndex = useRef(0);
    let helpers = {};
    
    function compare(a, cord){
        blocks.forEach(block => {
        if(!(a.getBoundingClientRect().top > block.elem.getBoundingClientRect().bottom ||
        a.getBoundingClientRect().right < block.elem.getBoundingClientRect().left ||
        a.getBoundingClientRect().bottom < block.elem.getBoundingClientRect().top ||
        a.getBoundingClientRect().left > block.elem.getBoundingClientRect().right)){
            //measuring surface area
        let allArea = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
        let z = a.getBoundingClientRect().x - block.elem.getBoundingClientRect().x;
        let v = a.getBoundingClientRect().y - block.elem.getBoundingClientRect().y;
        z = Math.abs(z);
        v = Math.abs(v);
        let m = a.getBoundingClientRect().width - z;
        let n = a.getBoundingClientRect().height - v;
        let area = m*n;
        
        //When floater is hovering above 
        if((area/allArea * 100) > 50){
            block.setState(true);
            block.isActive = true;
            //check if it has subject
            if(subjectArray[block.id] !== ""){
                let index = block.id;
                const newArray = [...subjectArray];
                if(subjectArray[index-1 !== 0 ? index - 1: 0] === ""){
                    newArray[index-1] = subjectArray[index];
                    newArray[index] = "";
                    coord.current = cord;
                    setSubjectArray(newArray);
                } else if(subjectArray[index+1] === ""){
                    newArray[index+1] = subjectArray[index];
                    newArray[index] = "";
                    coord.current = cord;
                    setSubjectArray(newArray);
                } else {
                    console.log("No free space found");
                }
            }
        } else if(block.isActive) { //block already active
            block.isActive = false;
            block.setState(false);
        }
    }
        });
    }
    
    function addBlock(index, obj){
        blocks[index] = obj;
    }
    
    function placeSubject(){
        //Check if any block is active/highlighted
        let foundActive = false;
        blocks.forEach(block => {
            if(block.isActive){
                const newArray = [...subjectArray];
                newArray[block.id] = subject;
                setSubjectArray(newArray);
                block.setState(false);
                setSubject("");
                foundActive = true;
                return;
            }
        });
        //if no block active, return subject to its original block
        if(!foundActive){
            // console.log("Prev " + prevSubjectArray);
            setSubjectArray(prevSubjectArray.current);
            // subjectArray[arrayIndex.current] = subject;
            setSubject("");
        }
    }
    
    function moveSubject(subjectName, blockId, cord){
        arrayIndex.current = blockId;
        prevSubjectArray.current = [...subjectArray];
        subjectArray[arrayIndex.current] = "";
        coord.current = cord;
        setSubject(subjectName);
    }
    
    helpers.addBlock = addBlock;
    helpers.moveSubject = moveSubject;
    helpers.compare = compare;
    helpers.placeSubject = placeSubject;
    
    useEffect(() => {
    return () => {
        blocks = [];
    };
    },[]);
    
    return (
        <div className="Slot">
            {subjectArray.map((value, index) => {
                return <Blocke helpers={helpers} sub={value} blockId={index}/>;
            })}
            {subject !== "" ? <Float helpers={helpers} sub={subject} coord={coord.current}/> : null}
        </div>
    );
}

