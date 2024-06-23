import React, { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";
import { saveData, getAllData } from "./indexDb";

const ROW_HEIGHT = 35;
const COLUMN_WIDTH = 100;
const VISIBLE_ROWS = 20;
const VISIBLE_COLUMNS = 20;

function App() {
  const initialRows = 2000;
  const initialColumns = 2000;

  const createInitialData = (rows, columns) => {
    const data = new Array(rows)
      .fill(null)
      .map(() => new Array(columns).fill(""));
    return data;
  };

  const [data, setData] = useState(() =>
    createInitialData(initialRows, initialColumns)
  );
  const [startRow, setStartRow] = useState(0);
  const [startColumn, setStartColumn] = useState(0);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getAllData("tableDB", "cells");
      if (storedData.length > 0) {
        const newData = createInitialData(initialRows, initialColumns);
        storedData.forEach((cell) => {
          newData[cell.rowIndex][cell.columnIndex] = cell.value;
        });
        setData(newData);
      }
    };

    fetchData();
  }, []);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollLeft } = tableContainerRef.current;
    const newStartRow = Math.floor(scrollTop / ROW_HEIGHT);
    const newStartColumn = Math.floor(scrollLeft / COLUMN_WIDTH);
    setStartRow(newStartRow);
    setStartColumn(newStartColumn);
  }, []);

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const { value } = event.target;
    const newData = [...data];
    newData[rowIndex][columnIndex] = value;
    setData(newData);

    saveData("tableDB", "cells", { rowIndex, columnIndex, value });
  };

  const visibleData = data
    .slice(startRow, startRow + VISIBLE_ROWS)
    .map((row, rowIndex) => (
      <tr key={startRow + rowIndex} className="rows">
        {row
          .slice(startColumn, startColumn + VISIBLE_COLUMNS)
          .map((cell, columnIndex) => (
            <td key={startColumn + columnIndex}>
              <input
                type="text"
                defaultValue={cell}
                onBlur={(event) =>
                  handleCellChange(
                    event,
                    startRow + rowIndex,
                    startColumn + columnIndex
                  )
                }
                style={{
                  width: COLUMN_WIDTH,
                  height: ROW_HEIGHT,
                  boxSizing: "border-box",
                }}
              />
            </td>
          ))}
      </tr>
    ));

  return (
    <div className="App">
      <div
        className="table-container"
        onScroll={handleScroll}
        ref={tableContainerRef}
        style={{
          width: VISIBLE_COLUMNS * COLUMN_WIDTH,
          height: VISIBLE_ROWS * ROW_HEIGHT,
          overflow: "auto",
          position: "relative",
          border: "1px solid #ccc",
        }}
      >
        <div
          style={{
            height: initialRows * ROW_HEIGHT,
            width: initialColumns * COLUMN_WIDTH,
            position: "relative",
          }}
        >
          <table
            className="table"
            style={{
              transform: `translate(${startColumn * COLUMN_WIDTH}px, ${
                startRow * ROW_HEIGHT
              }px)`,
            }}
          >
            <tbody>{visibleData}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
