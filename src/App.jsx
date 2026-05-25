import React, { useState, useEffect } from 'react';
import PlantList from './components/PlantList';
import PlantDetail from './components/PlantDetail';
import Grid from './components/Grid';
import usePlantStore from './hooks/usePlantStore';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list', 'detail', 'grid'
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [filterType, setFilterType] = useState('courtyard'); // 'courtyard', 'container', 'indoor'
  
  const plants = usePlantStore((state) => state.plants);
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
  }, [plants, getState]);

  const handlePlantTap = (plantId) => {
    setSelectedPlantId(plantId);
    setView('detail');
  };

  const handleBackFromDetail = () => {
    setView('list');
    setSelectedPlantId(null);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const getPlantsByType = (type) => {
    return plants.filter((p) => p.locationType === type);
  };

  const courtyardCount = getPlantsByType('courtyard').length;
  const containerCount = getPlantsByType('container').length;
  const indoorCount = getPlantsByType('indoor').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">🌱 Garden Tracker</h1>
          <p className="text-xs text-gray-600">Photo timeline & progress</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-14 z-10">
        <div className="flex gap-0">
          <button
            onClick={() => { handleViewChange('list'); setFilterType('courtyard'); }}
            className={`flex-1 py-3 px-2 border-b-2 font-semibold text-sm text-center ${
              view === 'list' && filterType === 'courtyard'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Courtyard ({courtyardCount})
          </button>
          <button
            onClick={() => { handleViewChange('list'); setFilterType('container'); }}
            className={`flex-1 py-3 px-2 border-b-2 font-semibold text-sm text-center ${
              view === 'list' && filterType === 'container'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Containers ({containerCount})
          </button>
          <button
            onClick={() => { handleViewChange('list'); setFilterType('indoor'); }}
            className={`flex-1 py-3 px-2 border-b-2 font-semibold text-sm text-center ${
              view === 'list' && filterType === 'indoor'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Indoor ({indoorCount})
          </button>
          <button
            onClick={() => handleViewChange('grid')}
            className={`flex-1 py-3 px-2 border-b-2 font-semibold text-sm text-center ${
              view === 'grid'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            Grid
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20">
        {view === 'list' && (
          <PlantList
            filterType={filterType}
            plants={plants}
            onPlantTap={handlePlantTap}
          />
        )}

        {view === 'detail' && selectedPlantId && (
          <PlantDetail
            plantId={selectedPlantId}
            onBack={handleBackFromDetail}
          />
        )}

        {view === 'grid' && (
          <div className="p-4">
            <Grid onCellClick={() => { handleViewChange('list'); setFilterType('courtyard'); }} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;