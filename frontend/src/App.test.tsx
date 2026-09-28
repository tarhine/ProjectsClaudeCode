import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('affiche le titre principal', () => {
    render(<App />)

    expect(screen.getByText('React + Vite + TypeScript')).toBeInTheDocument()
  })

  it('affiche les actions principales', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Commencer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Documentation' })).toBeInTheDocument()
  })
})
