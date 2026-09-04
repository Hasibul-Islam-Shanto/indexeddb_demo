import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ExpenseList } from './expense-list'
import { sampleExpense, sampleExpense2 } from '../../test/fixtures'

describe('ExpenseList', () => {
  it('shows loading state', () => {
    render(
      <ExpenseList
        expenses={[]}
        loading
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Loading expenses…')).toBeInTheDocument()
  })

  it('shows empty state when no expenses', () => {
    render(
      <ExpenseList
        expenses={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('No expenses found')).toBeInTheDocument()
  })

  it('renders expense rows', () => {
    render(
      <ExpenseList
        expenses={[sampleExpense, sampleExpense2]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Bus fare')).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(
      <ExpenseList
        expenses={[sampleExpense]}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit Coffee' }))
    expect(onEdit).toHaveBeenCalledWith(sampleExpense)
  })

  it('calls onDelete only when delete is confirmed', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <ExpenseList
        expenses={[sampleExpense]}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Delete Coffee' }))
    expect(onDelete).toHaveBeenCalledWith('exp-1')

    confirmSpy.mockReturnValue(false)
    await user.click(screen.getByRole('button', { name: 'Delete Coffee' }))
    expect(onDelete).toHaveBeenCalledTimes(1)

    confirmSpy.mockRestore()
  })
})
