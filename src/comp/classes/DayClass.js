const NUMBER_OF_SLOTS = 6;

export class DayClass {

    static _totalCount = -1;
    static _currentIndexActive = -1;
    
    constructor(day){
        this.day = day;
        this.blocksPerSlot = 5;
        this.arr = [];
        this.index = -1;
        this.NUMBER_OF_SLOTS = NUMBER_OF_SLOTS;
        this.index = ++DayClass._totalCount;

        if(this.arr.length === 0){
            for(let i = 0; i < NUMBER_OF_SLOTS*this.blocksPerSlot; i++){
                this.arr.push("");
            }
        }
    }
    
    getName(){
        return this.day;
    }

    getIndex(){
        return this.index;
    }

    getNumberOfSlots(){
        return this.NUMBER_OF_SLOTS;
    }

    getBlocksPerSlot(){
        return this.blocksPerSlot;
    }
    
    addSubject(subject,index){
        this.arr[index] = subject;
    }
    
    getArr(){
        return this.arr;
    }

    setArr(arr){
        this.arr = arr;
        console.log("Array set");
    }
    
    addBlockPerSlot(){
        let shift = 0;
        for(let i = 1; i <= this.NUMBER_OF_SLOTS; i++){
            if(i !== this.NUMBER_OF_SLOTS){
                this.arr.splice(this.blocksPerSlot*i+shift,0,"");
                shift++;
            }else{
                this.arr.push("");
            }
        }
        this.blocksPerSlot++;
    }

    removeBlockPerSlot(){
        for(let i = 0; i <= this.NUMBER_OF_SLOTS; i++){
          this.arr.splice((this.blocksPerSlot-1)*(1+i),1);
        }
        this.blocksPerSlot--;
    }

    setBlankSpace(atIndex){
        this.arr[atIndex] = "";
    }


  }