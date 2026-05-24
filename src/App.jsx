import React, { useState, useEffect } from 'react';
import Grid from './components/Grid';
import PlantForm from './components/PlantForm';
import usePlantStore from './hooks/usePlantStore';
import './App.css';

function App() {
  const [selectedCell, setSelectedCell] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState('courtyard');
  
  const plants = usePlantStore((state) => state.plants);
  const containers = usePlantStore((state) => state.containers);
  const getState = usePlantStore((state) => state.getState);
  const loadFromStorage = usePlantStore((state) => state.loadFromStorage);

  useEffect(() => {
    const stored = localStorage.getItem('garden-tracker-state');
    if (stored) {
      try {
        loadFromStorage(JSON.parse(stored));
      } catch (err) {
        console.error('Storage load failed:', err);
      }
    }
  }, [loadFromStorage]);

  useEffect(() => {
    localStorage.setItem('garden-tracker-state', JSON.stringify(getState()));
  }, [plants, containers, getState]);

  const handleCellClick = (cellId) => {
    setSelectedCell(cellId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCell(null);
  };

  const courtyardPlants = plants.filter((p) => p.locationType === 'courtyard');
  const containerPlants = plants.filter((p) => p.locationType === 'container');
  const indoorPlants = plants.filter((p) => p.locationType === 'indoor');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🌱 Garden Tracker</h1>
            <p className="text-sm text-gray-600">Photo timeline & progress tracking</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            + Add Plant
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          <button onClick={() => setView('courtyard')} className={`py-3 px-2 border-b-2 font-semibold ${view === 'courtyard' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-600'}`}>
            Courtyard ({courtyardPlants.length})
          </button>
          <button onClick={() => setView('containers')} className={`py-3 px-2 border-b-2 font-semibold ${view === 'containers' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-600'}`}>
            Containers ({containerPlants.length})
          </button>
          <button onClick={() => setView('indoor')} className={`py-3 px-2 border-b-2 font-semibold ${view === 'indoor' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-600'}`}>
            Indoor ({indoorPlants.length})
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'courtyard' && (
          <div>
            <Grid onCellClick={handleCellClick} />
            {courtyardPlants.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Plants in Courtyard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courtyardPlants.map((plant) => (
                    <div key={plant.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                      <h4 className="font-semibold text-gray-800">{plant.name}</h4>
              <p className="text-sm text-gray-600">📍 Cell {plant.locationId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'containers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Container Plants</h3>
            {containerPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {containerPlants.map((plant) => (
                  <div key={plant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800">{plant.name}</h4>
                    <p className="text-sm text-gray-600">🪴 {plant.locationId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No container plants yet.</p>
            )}
          </div>
        )}

        {view === 'indoor' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Indoor Grow Setup</h3>
            {indoorPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {indoorPlants.map((plant) => (
                  <div key={plant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800">{plant.name}</h4>
                    <p className="text-sm text-gray-600">💡 {plant.locationId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No indoor plants yet.</p>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <PlantForm cellId={selectedCell} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
}

export default App;