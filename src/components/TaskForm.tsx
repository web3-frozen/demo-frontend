import { useState } from 'react';
import type { CreateTaskRequest } from '../types/task';

interface Props {
  onSubmit: (req: CreateTaskRequest) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={submitting}
        />
        <select value={priority} onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={2}
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
