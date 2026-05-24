import React, { useState } from 'react';
import usePlantStore from '../hooks/usePlantStore';

const PlantForm = ({ cellId = null, onClose }) => {
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState('courtyard');
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedIndoorArea, setSelectedIndoorArea] = useState('');
  const [newContainerName, setNewContainerName] = useState('');
  const [newContainerSize, setNewContainerSize] = useState('');

  const addPlant = usePlantStore((state) => state.addPlant);
  const addContainer = usePlantStore((state) => state.addContainer);
  const containers = usePlantStore((state) => state.containers);
  const indoorAreas = usePlantStore((state) => state.indoorAreas);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    let locationId = cellId || null;

    if (locationType === 'courtyard' && !cellId) {
      alert('Please select a grid cell for courtyard plants.');
      return;
    }

    if (locationType === 'container') {
      if (newContainerName) {
        const newContainer = addContainer(newContainerName, newContainerSize);
        locationId = newContainer.id;
      } else if (selectedContainer) {
        locationId = selectedContainer;
      } else {
        alert('Please select or create a container.');
        return;
      }
    }

    if (locationType === 'indoor') {
      locationId = selectedIndoorArea || indoorAreas[0];
    }

    addPlant(name, locationType, locationId);
    setName('');
    setLocationType('courtyard');
    setSelectedContainer('');
    setNewContainerName('');
    setNewContainerSize('');
    setSelectedIndoorArea('');
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Add Plant</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Tomato seedling"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Location Type</label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="courtyard">Courtyard Grid</option>
            <option value="container">Container (pot/planter)</option>
            <option value="indoor">Indoor Grow Setup</option>
          </select>
        </div>

        {locationType === 'courtyard' && cellId && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Location:</span> Grid cell <span className="font-mono bg-white px-2 py-1 rounded">{cellId}</span>
            </p>
          </div>
        )}

        {locationType === 'container' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Use existing container</label>
              <select
                value={selectedContainer}
                onChange={(e) => setSelectedContainer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select container --</option>
                {containers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.size})
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 mb-2">Or create a new one:</p>
              <input
                type="text"
                value={newContainerName}
                onChange={(e) => setNewContainerName(e.target.value)}
                placeholder="Container name (e.g., 10L pot #3)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newContainerSize}
                onChange={(e) => setNewContainerSize(e.target.value)}
                placeholder="Size (e.g., 10L)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {locationType === 'indoor' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Grow Light Area</label>
            <select
              value={selectedIndoorArea}
              onChange={(e) => setSelectedIndoorArea(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select area --</option>
              {indoorAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg">
            Add Plant
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm;