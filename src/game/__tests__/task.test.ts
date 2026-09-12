import { describe, it, expect } from 'vitest'
import { Task } from '../Task'

describe('Task', () => {
  it('判定函数', () => {
    expect(new Task(3, 3, Task.eq).ok()).toBe(true)
    expect(new Task(2, 3, Task.ge).ok()).toBe(false)
    expect(new Task(4, 3, Task.le).ok()).toBe(false)
    expect(new Task(4, 3, Task.leIncreasing).fail()).toBe(true)
    expect(new Task(3, 3, Task.leIncreasing).ok()).toBe(true)
  })
  it('add/set', () => {
    const t = new Task(0, 5, Task.eq)
    t.add(2)
    t.add(1)
    expect(t.now).toBe(3)
    t.set(5)
    expect(t.ok()).toBe(true)
  })
})
