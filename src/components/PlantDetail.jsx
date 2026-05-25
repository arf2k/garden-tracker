import React, { useState } from 'react';
import usePlantStore from '../hooks/usePlantStore';

const PlantDetail = ({ plantId, onBack }) => {
  const plants = usePlantStore((state) => state.plants);
  const plant = plants.find((p) => p.id === plantId);
  const editPlant = usePlantStore((state) => state.editPlant);
  const deletePlant = usePlantStore((state) => state.deletePlant);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(plant?.name || '');

  if (!plant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Plant not found</p>
      </div>
    );
  }

  const getLocationDisplay = () => {
    if (plant.locationType === 'courtyard') return `📍 Courtyard - Cell ${plant.locationId}`;
    if (plant.locationType === 'container') return `🪴 Container`;
    if (plant.locationType === 'indoor') return `💡 ${plant.locationId}`;
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      editPlant(plantId, { name: editName });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${plant.name}"? This cannot be undone.`)) {
      deletePlant(plantId);
      onBack();
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-2xl text-gray-600 active:text-gray-800"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex-1 truncate">
          {plant.name}
        </h2>
      </div>

      {/* Plant Info Section */}
      <div className="px-4 py-4 space-y-4">
        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold mb-1">Location</p>
          <p className="text-lg text-gray-800">{getLocationDisplay()}</p>
        </div>

        {/* Created Date */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold mb-1">Added</p>
          <p className="text-lg text-gray-800">
            {new Date(plant.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Plant'}
        </button>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plant Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <button 
              onClick={handleSaveEdit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Photo Section (Phase 4) */}
        <div className="border-t-2 border-gray-200 pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Photo Timeline</h3>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">
              Photo upload coming in Phase 4
            </p>
            <p className="text-gray-400 text-xs mt-2">
              You'll be able to add and view chronological photos here
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <div className="border-t-2 border-gray-200 pt-4">
          <button 
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Delete Plant
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;