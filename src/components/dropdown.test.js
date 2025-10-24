import { describe, it, expect, beforeEach } from 'vitest'
import { page } from '@vitest/browser/context'
import axe from 'axe-core'
import './dropdown.js'

/**
 * Dropdown Component Tests
 *
 * Tests component rendering, user interactions, event handling,
 * and accessibility with axe-core
 */

describe('Dropdown Component', () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <ps-dropdown>
        <button slot="trigger" id="trigger-btn">Open Menu</button>
        <div slot="content">
          <a href="#option1" id="option1">Option 1</a>
          <a href="#option2" id="option2">Option 2</a>
          <a href="#option3" id="option3">Option 3</a>
        </div>
      </ps-dropdown>
    `
    // Wait for component to be defined
    await customElements.whenDefined('ps-dropdown')
    // Give shadow DOM time to render
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  it('should render the component', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    expect(dropdown).toBeTruthy()
    expect(dropdown.shadowRoot).toBeTruthy()
  })

  it('should have trigger slot content', async () => {
    const trigger = document.getElementById('trigger-btn')
    expect(trigger).toBeTruthy()
    expect(trigger.textContent).toBe('Open Menu')
  })

  it('should start closed', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    expect(dropdown.open).toBe(false)
    expect(dropdown.hasAttribute('open')).toBe(false)
  })

  it('should open when trigger is clicked', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(dropdown.open).toBe(true)
    expect(dropdown.hasAttribute('open')).toBe(true)
  })

  it('should close when trigger is clicked again', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    // Open
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(true)

    // Close
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(false)
  })

  it('should close when clicking outside', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    // Open dropdown
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(true)

    // Click outside
    document.body.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(false)
  })

  it('should close when Escape key is pressed', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    // Open dropdown
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(true)

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(dropdown.open).toBe(false)
  })

  it('should dispatch ps-dropdown-open event when opened', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    let eventFired = false
    dropdown.addEventListener('ps-dropdown-open', () => {
      eventFired = true
    })

    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(eventFired).toBe(true)
  })

  it('should dispatch ps-dropdown-close event when closed', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const trigger = document.getElementById('trigger-btn')

    // Open first
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))

    let eventFired = false
    dropdown.addEventListener('ps-dropdown-close', () => {
      eventFired = true
    })

    // Close
    await trigger.click()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(eventFired).toBe(true)
  })

  it('should have no accessibility violations', async () => {
    const results = await axe.run(document.body)
    expect(results.violations).toHaveLength(0)
  })

  it('should have role="menu" on content', async () => {
    const dropdown = document.querySelector('ps-dropdown')
    const content = dropdown.shadowRoot.querySelector('.content')
    expect(content.getAttribute('role')).toBe('menu')
  })
})
