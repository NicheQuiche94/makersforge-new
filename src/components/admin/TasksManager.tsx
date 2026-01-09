"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Check, Loader2, Calendar, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  entity_type?: string;
  entity_id?: string;
  completed: boolean;
  completed_at?: string;
}

interface TasksManagerProps {
  tasks: Task[];
}

export function TasksManager({ tasks }: TasksManagerProps) {
  const router = useRouter();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  async function addTask() {
    if (!newTaskTitle.trim()) return;
    setAdding(true);

    await supabase.from("tasks").insert({
      title: newTaskTitle.trim(),
      due_date: newTaskDueDate || null,
    });

    setNewTaskTitle("");
    setNewTaskDueDate("");
    setAdding(false);
    router.refresh();
  }

  async function toggleComplete(task: Task) {
    setUpdatingId(task.id);

    await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null,
      })
      .eq("id", task.id);

    setUpdatingId(null);
    router.refresh();
  }

  async function deleteTask(taskId: string) {
    setUpdatingId(taskId);
    await supabase.from("tasks").delete().eq("id", taskId);
    setUpdatingId(null);
    router.refresh();
  }

  function isOverdue(dueDate?: string) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  function formatDueDate(dueDate?: string) {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString();
  }

  return (
    <div>
      {/* Add New Task */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-brand-orange/50"
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-orange/50"
        />
        <button
          onClick={addTask}
          disabled={adding || !newTaskTitle.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 disabled:opacity-50 transition-colors"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add
        </button>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-2 mb-6">
        {pendingTasks.map((task) => {
          const overdue = isOverdue(task.due_date);
          return (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                overdue ? "bg-red-500/10 border border-red-500/20" : "bg-white/5"
              }`}
            >
              <button
                onClick={() => toggleComplete(task)}
                disabled={updatingId === task.id}
                className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-green-500 hover:bg-green-500/20 transition-colors flex items-center justify-center"
              >
                {updatingId === task.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                )}
              </button>
              <div className="flex-1">
                <p className="text-white">{task.title}</p>
                {task.due_date && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    overdue ? "text-red-400" : "text-white/40"
                  }`}>
                    {overdue && <AlertCircle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    {formatDueDate(task.due_date)}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                disabled={updatingId === task.id}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
        {pendingTasks.length === 0 && (
          <p className="text-white/40 text-sm text-center py-4">No pending tasks</p>
        )}
      </div>

      {/* Completed Tasks Toggle */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-white/60 hover:text-white text-sm mb-3 transition-colors"
          >
            {showCompleted ? "Hide" : "Show"} completed ({completedTasks.length})
          </button>
          
          {showCompleted && (
            <div className="space-y-2 opacity-60">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <button
                    onClick={() => toggleComplete(task)}
                    disabled={updatingId === task.id}
                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    {updatingId === task.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <p className="flex-1 text-white line-through">{task.title}</p>
                  <button
                    onClick={() => deleteTask(task.id)}
                    disabled={updatingId === task.id}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}