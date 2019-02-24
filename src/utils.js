export const getOffset = el => {
  if (!el) {
    return {
      left: 0,
      top: 0,
    }
  }

  const rect = el.getBoundingClientRect()
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  }
}

export const getOuterWidth = el => {
  return el.offsetWidth
}

export const getOuterHeight = el => {
  return el.offsetHeight
}

// Detect if the user is moving towards the currently activated
// submenu.
//
// If the mouse is heading relatively clearly towards
// the submenu's content, we should wait and give the user more
// time before activating a new row. If the mouse is heading
// elsewhere, we can immediately activate a new row.

export const getSlope = (a, b) => {
  return (b.y - a.y) / (b.x - a.x)
}
