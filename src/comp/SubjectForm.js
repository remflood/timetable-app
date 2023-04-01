import { useState, useRef, useEffect } from 'react';
import { SubClass } from './classes/SubClass';
import './stylesheets/subjectform.css'


export default function SubjectForm({func}){

    const [subjectName, setSubjectName] = useState('');
    const [groups, setGroups] = useState(0);
    const [hasPractical, setHasPractical] = useState(false);
    const [state, setState] = useState("Add");

    let oldData = useRef('');
    
    function handleSubmit(e){
        e.preventDefault();
        if(state === "Add"){
            func.addSubject(subjectName, groups, hasPractical);
        } else if(state === "Update"){
            func.updateSubject(subjectName, groups, hasPractical, oldData.current);
        }
    }

    function onDelete(e){
        func.deleteSubject(subjectName);
        setSubjectName('');
        setGroups('');
        setHasPractical(false);
        setState("Add");
    }

    function changeState(e){
        if(e.target.value === "Add"){
            setSubjectName('');
            setGroups('');
            setHasPractical(false);
            setState("Add");
        } else if(e.target.value === "Update"){
            func.getSubjects().forEach(subject => {
                if(subject.getName() === e.target.innerHTML){
                    oldData.current = new SubClass(subject.getName(), subject.getGroups(), subject.getHasPractical(), []);
                    setSubjectName(subject.getName());
                    setGroups(subject.getGroups());
                    setHasPractical(subject.getHasPractical());
                    setState("Update");
                    return;
                }
            });
        }
    }
    
    useEffect(() => {
        
    });
    
    return (
        <div className="subjectform">
            <h3>{state} Subject</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Subject: {' '}
                    <input
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                    />
                </label>
                <label>
                    Groups: {' '}
                    <input
                        value={groups}
                        onChange={(e) => setGroups(e.target.value)}
                    />
                </label>
                <label>
                    Practical: {' '}
                    {hasPractical ? 
                    <input type={"checkbox"}
                        checked
                        value={hasPractical}
                        onChange={(e) => setHasPractical(e.target.checked)}
                    /> : 
                    <input type={"checkbox"}
                        value={hasPractical}
                        onChange={(e) => setHasPractical(e.target.checked)}
                    />}
                </label>
                <button type='submit' value={state}>{state}</button>
                {state === "Update" ?
                <button type='button' onClick={onDelete}>{"Delete"}</button> : null}
            </form>
            <h3>List of Subjects</h3>
            <button onClick={changeState} value={"Add"}>+</button>
            {func.getSubjects().map(subject => {
                return <button onClick={changeState} value={"Update"}>{subject.getName()}</button>;
            })}
        </div>
    );
    
}