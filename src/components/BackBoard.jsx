import { useMemo, useState } from "react";
import { PlusIcon } from "../utils/Icons";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const BackBoard = () => {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeCol, setActiveCol] = useState("");
  const [tasks, setTasks] = useState([])

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },}))


  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  const onDragStart = (event) => {
    console.log("drag start", event);
    if(event.active.data.current.type === "Column"){
      setActiveCol(event.active.data.current.column)
      return;
    }
  }

  const onDragEnd = (event) => {
    const {active, over} = event;
    if (!over) return ;
    const activeColId = active.id;
    const overColId = over.id;

    if (activeColId === overColId) return;

    setColumns(columns => {
      const activeColIndex = columns.findIndex((col) => col.id === activeColId);

      const overColIndex = columns.findIndex((col) => col.id === overColId);

      return arrayMove(columns, activeColIndex, overColIndex)
    })
  }

  const createNewColumn = () => {
    const newColumnTitle = `Column ${columns.length + 1}`;
    const columnToAdd = { id: generateId(), title: newColumnTitle };
    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  const updateColumn = (id, title) => {
    const newColumns = columns.map(col => {
      if(col.id !== id) return col;
      return {...col, title};
    })
    setColumns(newColumns)
  }

  const createTask = (columnId) => {
    const newTask = {id: generateId(), columnId, content: `Task ${tasks.length + 1}`}
    setTasks([...tasks, newTask] )
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-40">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="m-auto flex gap-2">
          <SortableContext items={columnsId}>
            <div className="flex gap-2">
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter(task => task.columnId === col.id)}
                />
              ))}
            </div>
          </SortableContext>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(<DragOverlay>
          {activeCol && <ColumnContainer column={activeCol} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask}/>}
        </DragOverlay>, document.body ) }     

      </DndContext>
    </div>
  );
};

export default BackBoard;
