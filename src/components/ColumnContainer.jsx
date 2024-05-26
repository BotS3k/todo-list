import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { PlusIcon, TrashIcon } from "../utils/Icons";
import { CSS } from "@dnd-kit/utilities";

const ColumnContainer = ({ column, deleteColumn, updateColumn, createTask, tasks }) => {

  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging  } = useSortable({
    id: column.id,
    data: { type: "Column", column }, disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if(isDragging){
    return(
      <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor opacity-40 border-2 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"></div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div className="flex gap-2">
        <div {...attributes} {...listeners} onClick={() => { setEditMode(true)}}
          className="bg-mainBackgroundColor flex justify-between w-full text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4">
          {!editMode && column.title}
          {editMode && <input className="bg-black focus:border-rose-500 border rounded outline-none px-2" autoFocus value={column.title} onChange={(e) => updateColumn(column.id, e.target.value)} onBlur={() => { setEditMode(false)}} onKeyDown={e => {
            if(e.key !== "Enter")return;
            setEditMode(false);
          }}/>}
          <button
            onClick={() => deleteColumn(column.id)}
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-grow">content</div>
      <button onClick={()=> {createTask(column.id)}} className="flex gap-2 items-center border-2 rounded p-4 border-columnBackgroundColor border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500"><PlusIcon/> Add Task</button>
    </div>
  );
};

export default ColumnContainer;

