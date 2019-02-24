import React from 'react'
import PropTypes from 'prop-types'

import { getOffset, getOuterWidth, getOuterHeight, getSlope } from './utils'

const MOUSE_LOCATIONS_TRACKED = 3
const DELAY = 300 // ms delay when user appears to be entering submenu
const TOLERANCE = 75 // bigger = more forgiveness when entering submenu

class SmartMenu extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  menu = null
  task = null
  mouseLocations = []
  lastDelayLocation = null

  componentWillUnmount() {
    this.removeMouseListener()
    this.clearTask()
  }

  addMouseListener = () => {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  removeMouseListener = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  clearTask = () => {
    if (this.task) {
      clearTimeout(this.task)
      this.task = null
    }
  }

  clearLocations = () => (this.mouseLocations = [])

  handleMouseMove = e => {
    this.mouseLocations.push({
      x: e.pageX,
      y: e.pageY,
    })

    if (this.mouseLocations.length > MOUSE_LOCATIONS_TRACKED) {
      this.mouseLocations.shift()
    }
  }

  onMenuEnter = () => {
    this.addMouseListener()
  }

  onMenuLeave = callback => {
    callback()

    this.removeMouseListener()
    this.clearTask()
  }

  onItemEnter = (callback, args) => {
    const delay = this.getDelay()
    this.clearTask()

    if (delay) {
      this.task = setTimeout(() => this.onItemEnter(callback, args), delay)
    } else {
      this.clearLocations()
      callback(args)
    }
  }

  getDelay = () => {
    // If can't find DOM node immediately activate
    if (!this.menu) {
      return 0
    }

    const menuOffset = getOffset(this.menu)

    const upperLeft = {
      x: menuOffset.left,
      y: menuOffset.top - TOLERANCE,
    }
    const upperRight = {
      x: menuOffset.left + getOuterWidth(this.menu),
      y: upperLeft.y,
    }
    const lowerLeft = {
      x: menuOffset.left,
      y: menuOffset.top + getOuterHeight(this.menu) + TOLERANCE,
    }
    const lowerRight = {
      x: menuOffset.left + getOuterWidth(this.menu),
      y: lowerLeft.y,
    }

    const loc = this.mouseLocations[this.mouseLocations.length - 1]
    let prevLoc = this.mouseLocations[0]

    if (!loc) {
      return 0
    }

    if (!prevLoc) {
      prevLoc = loc
    }

    // If the previous mouse location was outside of the entire
    // menu's bounds, immediately activate.
    if (
      prevLoc.x < menuOffset.left ||
      prevLoc.x > lowerRight.x ||
      prevLoc.y < menuOffset.top ||
      prevLoc.y > lowerRight.y
    ) {
      return 0
    }

    // If the mouse hasn't moved since the last time we checked
    // for activation status, immediately activate.
    if (
      this.lastDelayLocation &&
      loc.x === this.lastDelayLocation.x &&
      loc.y === this.lastDelayLocation.y
    ) {
      return 0
    }

    const decreasingSlope = getSlope(loc, upperRight)
    const increasingSlope = getSlope(loc, lowerRight)
    const prevDecreasingSlope = getSlope(prevLoc, upperRight)
    const prevIncreasingSlope = getSlope(prevLoc, lowerRight)

    // Mouse is moving from previous location towards the
    // currently activated submenu. Delay before activating a
    // new menu row, because user may be moving into submenu.
    if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
      this.lastDelayLocation = loc
      return DELAY
    }

    this.lastDelayLocation = null
    return 0
  }

  setMenuRef = menu => (this.menu = menu)

  render() {
    return this.props.children({
      onMenuEnter: this.onMenuEnter,
      onMenuLeave: this.onMenuLeave,
      onItemEnter: this.onItemEnter,
      setMenuRef: this.setMenuRef,
    })
  }
}

export default SmartMenu
