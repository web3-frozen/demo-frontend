import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import './App.css';

export default function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, refresh } = useTasks();

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="app">
      <header>
        <h1>📝 Task Manager</h1>
        <p className="subtitle">Powered by Go · PostgreSQL · Redis · Kafka · Linkerd mTLS</p>
        <button className="btn-refresh" onClick={refresh} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </header>

      <TaskForm onSubmit={async req => { await createTask(req); }} />

      {error && <div className="error">⚠️ {error}</div>}

      <div className="board">
        <div className="column">
          <h2>📋 To Do ({todoTasks.length})</h2>
          {todoTasks.map(t => (
            <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>
        <div className="column">
          <h2>🔄 In Progress ({inProgressTasks.length})</h2>
          {inProgressTasks.map(t => (
            <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>
        <div className="column">
          <h2>✅ Done ({doneTasks.length})</h2>
          {doneTasks.map(t => (
            <TaskCard key={t.id} task={t} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>
      </div>

      <footer>
        <p>Demo App — Homelab GitOps Platform</p>
      </footer>
    </div>
  );
}
