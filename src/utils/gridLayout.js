function pickSize(sizes, maxCols, maxRows) {
  const fitting = sizes.find((size) => size.cols <= maxCols && size.rows <= maxRows)
  if (fitting) return fitting

  const smallest = sizes[sizes.length - 1]
  return {
    cols: Math.min(smallest.cols, maxCols),
    rows: Math.min(smallest.rows, maxRows),
  }
}

function createOccupancy(columns, rows) {
  return Array.from({ length: rows }, () => new Array(columns).fill(false))
}

function fitsAt(occupancy, row, col, cols, rows, columns, totalRows) {
  if (col + cols > columns || row + rows > totalRows) return false

  for (let r = row; r < row + rows; r++) {
    for (let c = col; c < col + cols; c++) {
      if (occupancy[r][c]) return false
    }
  }
  return true
}

function findPlacement(occupancy, cols, rows, columns, totalRows) {
  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < columns; col++) {
      if (fitsAt(occupancy, row, col, cols, rows, columns, totalRows)) {
        return { row, col }
      }
    }
  }
  return null
}

function occupy(occupancy, row, col, cols, rows) {
  for (let r = row; r < row + rows; r++) {
    for (let c = col; c < col + cols; c++) {
      occupancy[r][c] = true
    }
  }
}

export function packGrid(items, columns, rows) {
  const safeColumns = Math.max(1, columns)
  const safeRows = Math.max(1, rows)

  const pages = []
  let occupancy = createOccupancy(safeColumns, safeRows)
  let pageItems = []

  for (const item of items) {
    const size = pickSize(item.sizes, safeColumns, safeRows)
    let placement = findPlacement(occupancy, size.cols, size.rows, safeColumns, safeRows)

    if (!placement) {
      pages.push(pageItems)
      occupancy = createOccupancy(safeColumns, safeRows)
      pageItems = []
      placement = findPlacement(occupancy, size.cols, size.rows, safeColumns, safeRows)
    }

    occupy(occupancy, placement.row, placement.col, size.cols, size.rows)
    pageItems.push({ ...item, cols: size.cols, rows: size.rows })
  }

  pages.push(pageItems)
  return pages
}
