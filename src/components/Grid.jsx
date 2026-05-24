import React from 'react';
import usePlantStore from '../hooks/usePlantStore';

const Grid = ({ onCellClick }) => {
  const plants = usePlantStore((state) => state.plants);
  const GRID_SIZE = 4;

  const getCellId = (row, col) => {
    const letter = String.fromCharCode(65 + row);
    return `${letter}${col + 1}`;
  };

  const getPlantsInCell = (cellId) => {
    return plants.filter((p) => p.locationType === 'courtyard' && p.locationId === cellId);
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Courtyard Layout</h2>
        <p className="text-sm text-gray-600">4×4 Grid</p>
      </div>

      <div className="inline-grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => {
            const cellId = getCellId(row, col);
            const cellPlants = getPlantsInCell(cellId);

            return (
              <button
                key={cellId}
                onClick={() => onCellClick(cellId)}
                className={`w-24 h-24 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 font-semibold text-sm cursor-pointer ${
                  cellPlants.length > 0
                    ? 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{cellId}</span>
                {cellPlants.length > 0 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    {cellPlants.length}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;