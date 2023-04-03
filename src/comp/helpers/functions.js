import { NUMBER_OF_SLOTS } from "./global";

export function isOverlapping(a,b){
    return !(a.getBoundingClientRect().top > b.getBoundingClientRect().bottom ||
                a.getBoundingClientRect().right < b.getBoundingClientRect().left ||
                a.getBoundingClientRect().bottom < b.getBoundingClientRect().top ||
                a.getBoundingClientRect().left > b.getBoundingClientRect().right)
}

export function getOverlapPercentage(a,b){
    let allArea = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
    let z = a.getBoundingClientRect().x - b.getBoundingClientRect().x;
    let v = a.getBoundingClientRect().y - b.getBoundingClientRect().y;
    z = Math.abs(z);
    v = Math.abs(v);
    let m = a.getBoundingClientRect().width - z;
    let n = a.getBoundingClientRect().height - v;
    return (m*n)/allArea * 100
}

export function generateBlocks(dayName, blocksPerSlot) {
    
    let arr = [];
    for(let i = 0; i < NUMBER_OF_SLOTS; i++){
        for(let j = 0; j < blocksPerSlot; j++){
            let block = {
                day: dayName,
                slot: i,
                id: j,
                subject: "",
                isHigh: false,
            }
            arr.push(block);
        }
    }
    return arr;
}

export function createSpace(index,arr){
    let temp = [];
    let found = false;
    if(arr.find(elem => elem === "") === undefined){
        console.log("No space found");
        return false;
    }
    if(index < arr.length){ 
        //Look up
        for(let i = index; i >= 0; i--){
            if(arr[i] !== ""){
                temp.unshift(arr[i]);
            }else{
                let count = i;
                temp.forEach(elem => {
                    arr[count] = elem;
                    count++;
                });
                arr[index] = "";
                found = true;
                break;
            }
        }
        if(!found){
            //Look down
            temp = [];
            for(let i = index; i < arr.length; i++){
                if(arr[i] !== ""){
                    temp.push(arr[i]);
                }else{
                    let count = index+1;
                    temp.forEach(elem => {
                        arr[count] = elem;
                        count++;
                    })
                    arr[index] = "";
                    break;
                }
            }
        }
        return arr;
    }else{
        console.log("Index is invalid");
        return false;
    }
}