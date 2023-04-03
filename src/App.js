import { useState, useRef, useEffect } from 'react';
import './App.css';
import Day from './comp/Day';
import Float from './comp/Float';
import {getOverlapPercentage, isOverlapping, createSpace, generateBlocks} from './comp/helpers/functions';
import { DayClass } from './comp/classes/DayClass';
import { SubClass } from './comp/classes/SubClass';
import Menu from './comp/Menu';
import SubjectForm from './comp/SubjectForm';
import SlotForm from './comp/SlotForm';


function App() {

  const OVERLAP_THRESHOLD = 50;
  const [floatSubject, setFloatSubject] = useState("");
  const [daysArray, setDaysArray] = useState([]);
  
  const [showMenu, setShowMenu] = useState({show: false, showRemove: false});
  const [subjectsList, setSubjectsList] = useState([]);
  const [showSlotMenu, setShowSlotMenu] = useState({show: false, data: null})

  const days = useRef([]);
  let subjectsArray = useRef([]);

  if(daysArray.length !== 0){
    console.log("Current daysArray: " + daysArray[0].blocks[0].subject);
  }
  
  // let blocks = new Map();
  let blocks = [];
  let dayElements = [];
  let func = [];
  let oldVersion = useRef([]);
  let oldVersionBlank = useRef([]);
  let coord = useRef(null);
  const menuPos = useRef(null);
  const countClick = useRef(0);
  const blockActive = useRef(null);

  function calOverlap(a){

    let activeDay = "";

    for(let dayElem of dayElements){
      if(isOverlapping(a,dayElem)){
        activeDay = dayElem.getAttribute("day");
        //dayElem get child div. (Future)
        break;
      }
    }

    for(let blockElem of blocks){
      if(blockElem.getAttribute("day") === activeDay && isOverlapping(a, blockElem)){
        if(getOverlapPercentage(a,blockElem) > OVERLAP_THRESHOLD && blockElem.getAttribute("class") !== "block highlight"){
          let newDaysArray = JSON.parse(JSON.stringify(daysArray));
          for(let day in newDaysArray){
            if(newDaysArray[day].blocks[0].day === activeDay){
              let blocks = newDaysArray[day].blocks;
              for (let index in blocks){
                let slot = blockElem.getAttribute("slot");
                let id = blockElem.getAttribute("id");
                if(blocks[index].slot == slot && blocks[index].id == id){
                  blocks[index].isHigh = true;
                  if(blocks[index].subject !== ""){
                    let filtered = blocks.filter(block => block.slot == slot);
                    let arr = [];
                    filtered.forEach(block => {
                      arr.push(block.subject);
                    });
                    arr = createSpace(blocks[index].id, arr);
                    blocks.forEach((block, index) => {
                      if(block.slot == slot){
                        block.subject = arr[index];
                      }
                    });
                  }
                  setDaysArray(newDaysArray);
                  break;
                }
              }
            }
          }
          
        }else if(getOverlapPercentage(a,blockElem) < OVERLAP_THRESHOLD && blockElem.getAttribute("class") === "block highlight"){
          let newDaysArray = JSON.parse(JSON.stringify(daysArray));
          newDaysArray.forEach(day => {
            if(day.blocks[0].day === activeDay){
              let blocks = day.blocks;
              blocks.forEach(block => {
                let slot = blockElem.getAttribute("slot");
                let id = blockElem.getAttribute("id");
                if(block.slot == slot && block.id == id){
                  block.isHigh = false;
                }
              });
            }
          });
          setDaysArray(newDaysArray);
        }
      }
    }

    // blocks.forEach((block, key, map) => {
    //   if(key.day === currentDay && isOverlapping(a, block.elem)){
    //     //When floater is hovering above
    //     if(getOverlapPercentage(a, block.elem) > OVERLAP_THRESHOLD && !block.isActive){
    //       block.setState(true);
    //       block.isActive = true;
    //       if(block.subject !== ""){ //if block has subject
    //         let newDayArray = [...days.current[key.day].getArr()]; 
    //           if(createSpace(block.id, newDayArray)){
    //             coord.current = cord;
    //             let newArray = JSON.parse(JSON.stringify(daysArray));
    //             newArray[key.day] = newDayArray;
    //             setDaysArray(newArray);
    //           }
    //       }
    //     } else if(getOverlapPercentage(a,block.elem) < OVERLAP_THRESHOLD && block.isActive) { //block already active
    //         block.isActive = false;
    //         block.setState(false);
    //         coord.current = cord;
    //         let newArray = JSON.parse(JSON.stringify(daysArray));
    //         newArray = oldVersionBlank.current;
    //         setDaysArray(newArray);
    //     }
    //   } else if(block.isActive){
    //       block.isActive = false;
    //       block.setState(false);
    //   }
    // });
  }

  function addBlock(index, obj, day){
    blocks.set({day: day, id: index}, obj);
  }

  function createFloat(block, cord){
    
    coord.current = cord;
    oldVersion.current = JSON.parse(JSON.stringify(daysArray));
    let newDaysArray = JSON.parse(JSON.stringify(daysArray));
    let isFound = false;
    for(let day of newDaysArray){
      if(day.blocks[0].day === block.day){
        isFound = true;
        for(let blk of day.blocks){
          if(blk.slot == block.slot && blk.id == block.id){
            blk.subject = "";
            break;
          }
        }
      }
      if(isFound){
        setDaysArray(newDaysArray);
        break;
      }
    }
    setFloatSubject(block.subject);
  }

  function placeSubject(){
    //Check if any block is found highlighted
    console.log("placeSubject: " + daysArray[0].blocks[0].subject);
    let foundActive = false;
    for(let blockElem of blocks){
      if(blockElem.getAttribute("class") === "block highlight"){
        let slot = blockElem.getAttribute("slot");
        let id = blockElem.getAttribute("id");
        foundActive = true;
        let newDaysArray = JSON.parse(JSON.stringify(daysArray));
          newDaysArray.forEach(day => {
            if(day.blocks[0].day === blockElem.getAttribute("day")){
              let blocks = day.blocks;
              for(let block of blocks){
                if(block.slot == slot && block.id == id){
                  block.isHigh = false;
                  block.subject = floatSubject;
                  break;
                }
              }
            }
          });
          setDaysArray(newDaysArray);
          if(foundActive)
            break;
      }
    }

    if(!foundActive){
      setDaysArray(oldVersion.current);
    }
    setFloatSubject("");
  }

  function openSubjectMenu(pos, day, blockId, showRemove){
    menuPos.current = pos;
    blockActive.current = {blockId: blockId, day: day};
    document.body.addEventListener('mousedown', closeMenu);
    function closeMenu(event){
      countClick.current++;
      if(countClick.current > 1){
        setShowMenu({show: false, showRemove: showRemove});
        document.body.removeEventListener('mousedown',closeMenu);
        countClick.current = 0;
      } 
    }
    setShowMenu({show: true, showRemove: showRemove});
  }

  function selectSubject(subject){
    const newArray = JSON.parse(JSON.stringify(daysArray));
    newArray[blockActive.current.day][blockActive.current.blockId] = subject;
    setDaysArray(newArray);
  }

  function removeSubject(){
    const newArray = JSON.parse(JSON.stringify(daysArray));
    newArray[blockActive.current.day][blockActive.current.blockId] = "";
    setDaysArray(newArray);
  }

  function addSubject(subject, groups, hasPractical){
    subjectsArray.current.push(new SubClass(subject, groups, hasPractical, []));
    updateSubjectList();
  }

  function getSubjects(){
    return subjectsArray.current;
  }

  function updateSubject(subjectName, groups, hasPractical, oldData){

    if(oldData.getName() !== subjectName){
      let newDaysArray = JSON.parse(JSON.stringify(daysArray));
      newDaysArray.forEach((day, index) => {
        const _index = index;
        day.forEach((subject, index) => {
          if(subject.substring(0, subject.indexOf(' ')) === oldData.getName()){
            newDaysArray[_index][index] = subjectName + ' ' + subject.substring(subject.indexOf(' ')+1);
          }
        });
      });
      setDaysArray(newDaysArray);
    }

    subjectsArray.current.forEach((subject, index) => {
      if(subject.getName() === oldData.getName()){
        subjectsArray.current[index] = new SubClass(subjectName, groups, hasPractical, []);
        updateSubjectList();
        return;
      }
    });
  }

  function deleteSubject(subjectName){
    subjectsArray.current.forEach((subject, index) => {
      if(subject.getName() === subjectName){
        const list = subject.getList();
        let newDaysArray = JSON.parse(JSON.stringify(daysArray));
        newDaysArray.forEach((day, index) => {
          let _index = index;
          day.forEach((subject, index) => {
            list.forEach(element => {
              if(subject === element){
                newDaysArray[_index][index] = "";
              }
            });
          });
        });
        setDaysArray(newDaysArray);
        subjectsArray.current = subjectsArray.current.filter(removeFilter);
        console.log(subjectsArray.current);
        updateSubjectList();
        return;
      }
    });

    function removeFilter(subject){
      if(subject.getName() === subjectName){
        return false;
      } else {
        return true;
      }
    }
  }

  function updateSubjectList(){
    let newSubjectList = []
    subjectsArray.current.forEach(subject => {
      newSubjectList.push(subject.getList());
    });
    newSubjectList = newSubjectList.flat();
    setSubjectsList(newSubjectList);
  }

  function openSlotMenu(dayIndex){
    const slotValue = days.current[dayIndex].getBlocksPerSlot();
    const _dayIndex = dayIndex;
    const obj = {
      show: true,
      data: {
        dayIndex: _dayIndex,
        slotValue: slotValue,
      }
    }
    setShowSlotMenu(obj);
  }

  function updateSlotValue(dayIndex, slotValue){
    const prevVal = days.current[dayIndex].getBlocksPerSlot();
    if(prevVal < slotValue){
      for(let i = 0; i < (slotValue-prevVal); i++){
        days.current[dayIndex].addBlockPerSlot();
      }
    } else if(prevVal > slotValue){
      for(let i = 0; i < (prevVal-slotValue); i++){
        days.current[dayIndex].removeBlockPerSlot();
      }
    }
    const newArray = [];
    days.current.forEach(day => {
      newArray[day.getIndex()] = day.getArr();
    });
    
    setDaysArray(newArray);
    setShowSlotMenu({show: false, data: null});
  }

  func.addBlock = addBlock;
  func.createFloat = createFloat;
  func.openSubjectMenu = openSubjectMenu;
  func.selectSubject = selectSubject;
  func.removeSubject = removeSubject;
  func.addSubject = addSubject;
  func.getSubjects = getSubjects;
  func.updateSubject = updateSubject;
  func.deleteSubject = deleteSubject;
  func.openSlotMenu = openSlotMenu;
  func.updateSlotValue = updateSlotValue;

  useEffect(() => {

    window.addEventListener("contextmenu", e => e.preventDefault());

    blocks = document.getElementsByClassName("block");
    dayElements = document.getElementsByClassName("day");
    // if(days.current.length === 0){
    //   days.current.push(new DayClass("Monday"));
    //   days.current.push(new DayClass("Tuesday"));
    //   days.current.push(new DayClass("Wednesday"));
    //   days.current.push(new DayClass("Thursday"));
    //   days.current.push(new DayClass("Friday"));
    //   days.current.push(new DayClass("Saturday"));
    //   days.current[0].addSubject("Physics",2);
    //   days.current[0].addSubject("Chemistry",0);
    //   days.current[1].addSubject("Biology",0);
    //   days.current[1].addSubject("Law",1);
    //   const newArray = [];
    //   days.current.forEach(day => {
    //     newArray[day.getIndex()] = day.getArr();
    //   });
    //   setDaysArray(newArray);
    // }

    // daysArray.forEach((value, index) => {
    //   dayElements.push(document.getElementById(index));
    // });

    if(daysArray.length === 0){
      let monday = {blocks: generateBlocks("Monday", 5)};
      let tuesday = {blocks: generateBlocks("Tuesday", 5)};
      monday.blocks[0].subject = "Law";
      monday.blocks[1].subject = "Physics";
      const newDaysArray = [monday, tuesday];
      setDaysArray(newDaysArray);
    }

    return () => {
      // dayElements = [];
      window.removeEventListener("contextmenu", e => e.preventDefault());
    }
  });

  return (
    <div className="App">
      {showSlotMenu.show ? <SlotForm func={func} data={showSlotMenu.data}/> : null}

      {daysArray.map(day => {
        return <Day day={day} func={func} />
      })}

      {/* <SubjectForm func={func}/> */}
      {floatSubject !== "" ? <Float calOverlap={calOverlap} placeSubject={placeSubject} 
        sub={floatSubject} coord={coord.current}/> : null}
      {/* {showMenu.show ? <Menu pos={menuPos.current} subjects={subjectsList} func={func} showRemove={showMenu.showRemove}/> : null} */}
    </div>
  );
}

export default App;
