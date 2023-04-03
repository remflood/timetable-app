import { useEffect, useState } from "react";
import Block from "./Block";
import { NUMBER_OF_SLOTS } from "./helpers/global";
import Slot from "./Slot";
import './stylesheets/day.css'

export default function Day({day, func}){

    let slots = [];
    let blocks = [];
    for(let i = 0; i < NUMBER_OF_SLOTS; i++){
        slots.push(
            <Slot blocks={day.blocks.filter(block => block.slot === i)} func={func} />
        );
    }

    useEffect(() => {

    });
    
    return (
        <div day={day.blocks[0].day} className="day">
            {slots}
        </div>
    );

}