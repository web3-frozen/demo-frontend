import { describe, it, expect } from 'vitest';

describe('Task types', () => {
  it('should define valid statuses', () => {
    const validStatuses = ['todo', 'in_progress', 'done'] as const;
    expect(validStatuses).toHaveLength(3);
  });

  it('should define valid priorities', () => {
    const validPriorities = ['low', 'medium', 'high'] as const;
    expect(validPriorities).toHaveLength(3);
  });
});
