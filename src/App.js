import { useState, useRef, useEffect } from 'react';
import './App.css';
import Day from './comp/Day';
import Float from './comp/Float';
import {getOverlapPercentage, isOverlapping, createSpace} from './comp/helpers/functions';
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
  
  let blocks = new Map();
  let dayElements = [];
  let func = [];
  let oldVersion = useRef([]);
  let oldVersionBlank = useRef([]);
  let coord = useRef(null);
  const menuPos = useRef(null);
  const countClick = useRef(0);
  const blockActive = useRef(null);

  function calOverlap(a, cord){
    
    let currentDay = -1;
    dayElements.forEach((element, index) => {
      if(isOverlapping(a,element)){
        currentDay = index;
        return;
      }
    });

    blocks.forEach((block, key, map) => {
      if(key.day === currentDay && isOverlapping(a, block.elem)){
        //When floater is hovering above
        if(getOverlapPercentage(a, block.elem) > OVERLAP_THRESHOLD && !block.isActive){
          block.setState(true);
          block.isActive = true;
          if(block.subject !== ""){ //if block has subject
            let newDayArray = [...days.current[key.day].getArr()]; 
              if(createSpace(block.id, newDayArray)){
                coord.current = cord;
                let newArray = JSON.parse(JSON.stringify(daysArray));
                newArray[key.day] = newDayArray;
                setDaysArray(newArray);
              }
          }
        } else if(getOverlapPercentage(a,block.elem) < OVERLAP_THRESHOLD && block.isActive) { //block already active
            block.isActive = false;
            block.setState(false);
            coord.current = cord;
            let newArray = JSON.parse(JSON.stringify(daysArray));
            newArray = oldVersionBlank.current;
            setDaysArray(newArray);
        }
      } else if(block.isActive){
          block.isActive = false;
          block.setState(false);
      }
    });
  }

  function addBlock(index, obj, day){
    blocks.set({day: day, id: index}, obj);
  }

  function createFloat(subjectName, dayIndex, blockId, cord){
    coord.current = cord;
    DayClass._currentIndexActive = dayIndex;
    // days.current[dayIndex].setBlankSpace(blockId);
    // const newArray = JSON.parse(JSON.stringify(daysArray));
    // newArray[dayIndex] = [...days.current[dayIndex].getArr()];
    // setDaysArray(newArray);

    oldVersion.current = JSON.parse(JSON.stringify(daysArray));
    const newArray = JSON.parse(JSON.stringify(daysArray));
    newArray[dayIndex][blockId] = "";
    days.current[dayIndex].setBlankSpace(blockId);
    oldVersionBlank.current = JSON.parse(JSON.stringify(newArray));
    setDaysArray(newArray);
    setFloatSubject(subjectName);
  }

  function placeSubject(){
    //Check if any block is active/highlighted
    let foundActive = false;
    blocks.forEach((block, key) => {
        if(block.isActive){
            days.current[key.day].getArr()[block.id] = floatSubject;
            let newArray = JSON.parse(JSON.stringify(daysArray));
            newArray[key.day] = [...days.current[key.day].getArr()];
            // const newArray = JSON.parse(JSON.stringify(daysArray));
            // newArray[key.day][block.id] = floatSubject;
            setDaysArray(newArray);
            block.setState(false);
            foundActive = true;
            return;
        }
    });
    //if no block active, return subject to its original block
    if(!foundActive){
        let newArray = JSON.parse(JSON.stringify(daysArray));
        // const dayIndex = DayClass._currentIndexActive;
        newArray = oldVersion.current;
        setDaysArray(newArray);
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

    if(days.current.length === 0){
      days.current.push(new DayClass("Monday"));
      days.current.push(new DayClass("Tuesday"));
      days.current.push(new DayClass("Wednesday"));
      days.current.push(new DayClass("Thursday"));
      days.current.push(new DayClass("Friday"));
      days.current.push(new DayClass("Saturday"));
      days.current[0].addSubject("Physics",2);
      days.current[0].addSubject("Chemistry",0);
      days.current[1].addSubject("Biology",0);
      days.current[1].addSubject("Law",1);
      const newArray = [];
      days.current.forEach(day => {
        newArray[day.getIndex()] = day.getArr();
      });
      setDaysArray(newArray);
    }

    daysArray.forEach((value, index) => {
      dayElements.push(document.getElementById(index));
    });

    return () => {
      dayElements = [];
      window.removeEventListener("contextmenu", e => e.preventDefault());
    }
  });

  return (
    <div className="App">
      {showSlotMenu.show ? <SlotForm func={func} data={showSlotMenu.data}/> : null}
      {/* <SubjectForm func={func}/> */}
      {daysArray.map((value, index) => {
                return <Day arr={value} func={func} dayIndex={index} day={days.current[index]}/>;
            })}
      {floatSubject !== "" ? <Float calOverlap={calOverlap} placeSubject={placeSubject} 
        sub={floatSubject} coord={coord.current}/> : null}
      {showMenu.show ? <Menu pos={menuPos.current} subjects={subjectsList} func={func} showRemove={showMenu.showRemove}/> : null}
    </div>
  );
}

export default App;
