import type { Task, UpdateTaskRequest } from '../types/task';

interface Props {
  task: Task;
  onUpdate: (id: string, req: UpdateTaskRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS_LABELS: Record<string, string> = {
  todo: '📋 To Do',
  in_progress: '🔄 In Progress',
  done: '✅ Done',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const NEXT_STATUS: Record<string, string> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const handleStatusToggle = () => {
    onUpdate(task.id, { status: NEXT_STATUS[task.status] as Task['status'] });
  };

  return (
    <div className={`task-card task-${task.status}`}>
      <div className="task-header">
        <span
          className="priority-badge"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
        >
          {task.priority}
        </span>
        <span className="task-status" onClick={handleStatusToggle} title="Click to change status">
          {STATUS_LABELS[task.status]}
        </span>
      </div>
      <h3>{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-footer">
        <time>{new Date(task.created_at).toLocaleDateString()}</time>
        <button className="btn-delete" onClick={() => onDelete(task.id)} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
