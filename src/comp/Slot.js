import { useState, useRef, useEffect } from 'react';
import Block from './Block';
import './stylesheets/slot.css'

export default function Slot({startIndex, array, func, day, blocksPerSlot}){

    let time = null;
    if(day === 0){
        switch(startIndex) {
            case 0:
                time = "8:00 - 9:10"
                break;
            case blocksPerSlot:
                time = "9:10 - 10:20"
                break;
            case blocksPerSlot*2:
                time = "10:40 - 11:50"
                break;
            case blocksPerSlot*3:
                time = "12:00 - 1:10"
                break;
            case blocksPerSlot*4:
                time = "1:10 - 2:20"
                break;
            case blocksPerSlot*5:
                time = "2:20 - 3:30"
                break;
        }
    } else if(day === 4) {
        switch(startIndex) {
            case 0:
                time = "8:00 - 9:10"
                break;
            case blocksPerSlot:
                time = "9:10 - 10:20"
                break;
            case blocksPerSlot*2:
                time = "10:20 - 11:30"
                break;
            case blocksPerSlot*3:
                time = "11:45 - 12:55"
                break;
            case blocksPerSlot*4:
                time = "12:55 - 2:05"
                break;
            case blocksPerSlot*5:
                time = "2:05 - 3:10"
                break;
        }
    }

    return (
        <div className="Slot">
            <div className='time'>{time}</div>
            {array.map((value, index) => {
                return <Block func={func} sub={value} blockId={index+startIndex} day={day}/>;
            })}
        </div>
    );
}

