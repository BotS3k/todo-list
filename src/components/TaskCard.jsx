import React, { useState } from 'react'
import { TrashIcon } from '../utils/Icons'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";


const TaskCard = ({key, task, deleteTask, updateTask}) => {

  const [mouseOver, setMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false)

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
});

const style = {
  transition,
  transform: CSS.Transform.toString(transform),
};

if(isDragging){
  return <div ref={setNodeRef} style={style} className='bg-mainBackgroundColor opacity-30 p-2.5 h-[100px] items-center flex text-left rounded-xl justify-between border-2 border-rose-500 cursor-grab'>
    
  </div>
}
  
  const toggleEdit = () => {
    setEditMode(!editMode)
    setMouseOver(false);
  }

  return (<span>

    {editMode && <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='bg-mainBackgroundColor p-2.5 h-[100px] items-center flex text-left rounded-xl justify-between hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab'>
      <input value={task.content || ''} autoFocus placeholder='task' onBlur={toggleEdit} onKeyDown={e => {
        if(e.key === 'Enter') toggleEdit()}}
        onChange={(e) => updateTask(task.id, e.target.value)}
        className='h-[35%] w-full flex justify-center resize-none border-none rounded bg-transparent text-white focus:outline-none'/>
    </div>}

    {!editMode && <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={toggleEdit} onMouseEnter={() => {setMouseOver(true)}} onMouseLeave={() => {setMouseOver(false)}} className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl justify-between hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab'>
        {task.content}
        {mouseOver && <button onClick={() => {
          deleteTask(task.id)
        }} className='stroke-white right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-40 hover:opacity-100'>
        <TrashIcon/></button> }
        </div>}

  </span>)
}

export default TaskCard
    