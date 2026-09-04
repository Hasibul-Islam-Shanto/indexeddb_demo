import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExpenseDrawer } from './expense-drawer'
import { sampleExpense } from '../../test/fixtures'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onSave: vi.fn().mockResolvedValue(undefined),
  onUpdate: vi.fn().mockResolvedValue(undefined),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ExpenseDrawer', () => {
  it('renders add mode title', () => {
    render(<ExpenseDrawer {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Add expense')).toBeInTheDocument()
  })

  it('renders edit mode with existing values', () => {
    render(<ExpenseDrawer {...defaultProps} expense={sampleExpense} />)
    expect(screen.getByText('Edit expense')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toHaveValue('Coffee')
    expect(screen.getByLabelText('Amount')).toHaveValue(5.5)
  })

  it('does not submit with empty description', async () => {
    const user = userEvent.setup()
    render(<ExpenseDrawer {...defaultProps} />)

    await user.type(screen.getByLabelText('Amount'), '10')
    await user.click(screen.getByRole('button', { name: 'Save expense' }))

    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('submits a new expense with rounded amount', async () => {
    const user = userEvent.setup()
    render(<ExpenseDrawer {...defaultProps} />)

    await user.clear(screen.getByLabelText('Amount'))
    await user.type(screen.getByLabelText('Amount'), '8.555')
    await user.type(screen.getByLabelText('Description'), 'Lunch')
    fireEvent.submit(screen.getByRole('dialog').querySelector('form')!)

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledOnce()
    })

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Lunch',
        amount: 8.56,
        category: 'food',
        note: undefined,
      }),
    )
  })

  it('submits an update in edit mode', async () => {
    const user = userEvent.setup()
    render(<ExpenseDrawer {...defaultProps} expense={sampleExpense} />)

    await user.clear(screen.getByLabelText('Description'))
    await user.type(screen.getByLabelText('Description'), 'Espresso')
    await user.click(screen.getByRole('button', { name: 'Update expense' }))

    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'exp-1',
          description: 'Espresso',
          amount: 5.5,
        }),
      )
    })
  })

  it('closes on Escape key', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ExpenseDrawer {...defaultProps} />)

    await user.keyboard('{Escape}')
    vi.advanceTimersByTime(200)

    await waitFor(() => {
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    vi.useRealTimers()
  })
})
