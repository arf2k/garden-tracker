import React, { useState } from 'react';
import usePlantStore from '../hooks/usePlantStore';

const PlantList = ({ filterType, plants, onPlantTap }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [selectedCell, setSelectedCell] = useState('A1');
  const [selectedContainer, setSelectedContainer] = useState('');
  const [newContainerName, setNewContainerName] = useState('');
  const [selectedIndoorArea, setSelectedIndoorArea] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  const addPlant = usePlantStore((state) => state.addPlant);
  const addContainer = usePlantStore((state) => state.addContainer);
  const containers = usePlantStore((state) => state.containers);
  const indoorAreas = usePlantStore((state) => state.indoorAreas);

  const filteredPlants = plants.filter((p) => p.locationType === filterType);

  // Group plants by location
  const groupedPlants = filteredPlants.reduce((acc, plant) => {
    const key = plant.locationId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(plant);
    return acc;
  }, {});

  const getLocationLabel = (locationId) => {
    if (filterType === 'courtyard') return `📍 Cell ${locationId}`;
    if (filterType === 'container') {
      const container = containers.find((c) => c.id === locationId);
      return `🪴 ${container?.name || 'Unknown'}`;
    }
    if (filterType === 'indoor') return `💡 ${locationId}`;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleAddPlant = () => {
    if (!plantName.trim()) return;

    let locationId = selectedCell;

    if (filterType === 'container') {
      if (newContainerName) {
        const newContainer = addContainer(newContainerName, '');
        locationId = newContainer.id;
      } else if (selectedContainer) {
        locationId = selectedContainer;
      } else {
        alert('Select or create a container');
        return;
      }
    }

    if (filterType === 'indoor') {
      locationId = selectedIndoorArea || indoorAreas[0];
    }

    addPlant(plantName, filterType, locationId);
    setPlantName('');
    setNewContainerName('');
    setSelectedContainer('');
    setSelectedIndoorArea('');
    setShowAddForm(false);
  };

  const gridCells = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4'];

  return (
    <div className="px-4 py-4 space-y-3">
      {filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No plants yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Add your first plant below
          </p>
        </div>
      ) : (
        Object.keys(groupedPlants).sort().map((groupId) => {
          const group = groupedPlants[groupId];
          const isExpanded = expandedGroups[groupId] !== false; // default expanded

          return (
            <div key={groupId} className="space-y-2">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupId)}
                className="w-full bg-gray-100 rounded-lg p-3 flex items-center justify-between hover:bg-gray-150 transition-colors text-left"
              >
                <span className="font-semibold text-gray-800">
                  {getLocationLabel(groupId)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                    {group.length}
                  </span>
                  <span className="text-lg text-gray-600">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </button>

              {/* Group Plants (collapsible) */}
              {isExpanded && (
                <div className="pl-2 space-y-2">
                  {group.map((plant) => (
                    <button
                      key={plant.id}
                      onClick={() => onPlantTap(plant.id)}
                      className="w-full bg-white rounded-lg shadow-sm p-4 text-left border-l-4 border-green-500 hover:shadow-md transition-shadow active:bg-green-50"
                    >
                      <h3 className="text-base font-semibold text-gray-800">{plant.name}</h3>
                      <p className="text-xs text-gray-500 mt-2">
                        {plant.photos.length} photo{plant.photos.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Add Plant Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg mt-4"
      >
        {showAddForm ? 'Cancel' : '+ Add Plant'}
      </button>

      {/* Add Plant Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plant Name
            </label>
            <input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g., Tomato seedling"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>

          {filterType === 'courtyard' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grid Cell
              </label>
              <select
                value={selectedCell}
                onChange={(e) => setSelectedCell(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {gridCells.map((cell) => (
                  <option key={cell} value={cell}>
                    {cell}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === 'container' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Existing Container
                </label>
                <select
                  value={selectedContainer}
                  onChange={(e) => setSelectedContainer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select --</option>
                  {containers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Or New Container Name
                </label>
                <input
                  type="text"
                  value={newContainerName}
                  onChange={(e) => setNewContainerName(e.target.value)}
                  placeholder="e.g., 10L pot #3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {filterType === 'indoor' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grow Light Area
              </label>
              <select
                value={selectedIndoorArea}
                onChange={(e) => setSelectedIndoorArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select --</option>
                {indoorAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddPlant}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
          >
            Add Plant
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantList;