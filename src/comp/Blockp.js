import { useState, useRef, useEffect } from 'react';
import './stylesheets/block.css'
import Subject from './Subject';

const DIST = 60;

function calDist(pointA, pointB){
    let a = pointB.x - pointA.x;
    let b = pointB.y - pointA.y;
    a = a*a;
    b = b*b;
    let z = a + b;
    
    return Math.sqrt(z);
}

export default function Block({id, func}){

    const [active, setActive] = useState(false);
    console.log("Block active state is: " + active);
    let block = null;
    let isActive = false;

    function getRef(element){
        block = element;
    }

    useEffect(() => {
        console.log("useEffect ran");
        console.log(block);
        document.body.addEventListener('mousemove',handleOnMouseMove);
        function handleOnMouseMove(e){
            if(block !== null){
                let d = calDist({x: block.offsetLeft + block.offsetWidth / 2, y: block.offsetTop + block.offsetHeight / 2}, {x: e.pageX, y: e.pageY});
                if(d <= DIST){
                    if(!active){
                        if(func(id,true)){
                            setActive(true);
                            document.body.removeEventListener('mousemove',handleOnMouseMove);
                        }
                    }
                } else {
                    if(active){
                        if(func(id,false)){
                            setActive(false);
                            document.body.removeEventListener('mousemove',handleOnMouseMove);
                        }
                    }
                }
            }
            return () => {
                document.body.removeEventListener('mousemove',handleOnMouseMove);
            }
            // console.log("Block: " + " d:" + distance({x: block.offsetLeft + block.offsetWidth / 2, y: block.offsetTop + block.offsetHeight / 2}, {x: e.pageX, y: e.pageY}));
        }
    });

    if(active){
        console.log("I printed Active");
        return (
            <div ref={getRef} className="block">I am Active</div>
        );
    } else {
        console.log("I printed not Active");
        return (
            <div ref={getRef} className="block"></div>
        );
    }
}