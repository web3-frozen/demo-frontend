import { useTasks } from './hooks/useTasks';
import { useCheckout } from './hooks/useCheckout';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import './App.css';

export default function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask, refresh } = useTasks();
  const checkout = useCheckout();
  const quote = checkout.result?.reservation.quote;
  const formattedQuote = quote
    ? new Intl.NumberFormat('en', { style: 'currency', currency: quote.currency }).format(
        quote.amount_cents / 100,
      )
    : null;

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

      <section className="checkout-panel" aria-label="Checkout flow">
        <div className="checkout-state">
          <span className="checkout-label">Checkout</span>
          <strong>
            {quote && checkout.result
              ? `${formattedQuote} · ${checkout.result.reservation.status}`
              : 'Ready'}
          </strong>
          {checkout.elapsedMs !== null && quote && (
            <span>
              {checkout.elapsedMs} ms · {quote.provider}
            </span>
          )}
        </div>
        <button type="button" onClick={checkout.runCheckout} disabled={checkout.loading}>
          {checkout.loading ? 'Running...' : 'Run checkout'}
        </button>
      </section>

      {error && <div className="error">⚠️ {error}</div>}
      {checkout.error && <div className="error">{checkout.error}</div>}

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
