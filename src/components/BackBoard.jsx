import { useMemo, useState } from "react";
import { PlusIcon } from "../utils/Icons";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const BackBoard = () => {
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeCol, setActiveCol] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  }));

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Column") {
      setActiveCol(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveCol(null);
    setActiveTask(null);
    if (!over) return;

    if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
      const activeColId = active.id;
      const overColId = over.id;

      if (activeColId === overColId) return;

      setColumns((columns) => {
        const activeColIndex = columns.findIndex((col) => col.id === activeColId);
        const overColIndex = columns.findIndex((col) => col.id === overColId);
        return arrayMove(columns, activeColIndex, overColIndex);
      });
    }

    if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
      const activeTaskId = active.id;
      const overTaskId = over.id;

      if (activeTaskId === overTaskId) return;

      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const overTaskIndex = tasks.findIndex((t) => t.id === overTaskId);

        const activeTask = tasks[activeTaskIndex];
        const overTask = tasks[overTaskIndex];

        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;
        }

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
      const activeTaskId = active.id;
      const overTaskId = over.id;

      if (activeTaskId === overTaskId) return;

      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const overTaskIndex = tasks.findIndex((t) => t.id === overTaskId);

        const activeTask = tasks[activeTaskIndex];
        const overTask = tasks[overTaskIndex];

        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;
        }

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }
  };

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
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const createTask = (columnId) => {
    const newTask = { id: generateId(), columnId, content: `Task ${tasks.length + 1}` };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  const updateTask = (id, content) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-40">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
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
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
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
        {createPortal(
          <DragOverlay>
            {activeCol && (
              <div className="bg-mainBackgroundColor opacity-30 w-[350px] h-[500px] rounded-md flex flex-col border-2 border-rose-500"></div>
            )}
            {activeTask && (
              <div className="bg-mainBackgroundColor opacity-30 p-2.5 h-[100px] items-center flex text-left rounded-xl justify-between border-2 border-rose-500 cursor-grab"></div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default BackBoard;
