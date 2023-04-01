export class SubClass {
    
    constructor(name, groups, hasPractical, teachersArray){
        this.name = name;
        this.groups = groups;
        this.hasPractical = hasPractical;
        this.teachersArray = teachersArray;
        this.createVariation();
    }
    
    createVariation(){
        this.list = [];
        if(this.groups > 1){
        for(let i = 1; i <= this.groups; i++){
            this.list.push(this.name + " GR " + i);
            if(this.hasPractical)
                this.list.push(this.name + " GR " + i + " PR");
        }
        } else {
            if(this.teachersArray.length === 0){
                this.list.push(this.name);
            } else {
                for(let i = 0; i < this.teachersArray.length; i++){
                    this.list.push(this.name + " (" + this.teachersArray[i] + ")");
                }
            }
        }
    }
    
    getList(){
        return this.list;
    }

    getName(){
        return this.name;
    }

    getGroups(){
        return this.groups;
    }

    getHasPractical(){
        return this.hasPractical;
    }
}




