import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const usePlantStore = create((set, get) => ({
  plants: [],
  containers: [],
  indoorAreas: ['Small Akerbar', 'Big Akerbar', 'Rudsta', 'Plant Table Top', 'Plant Table Bottom', 'Under Desk Light'],
  
  addPlant: (name, locationType, locationId) => {
    const newPlant = {
      id: uuidv4(),
      name,
      locationType,
      locationId,
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ plants: [...state.plants, newPlant] }));
    return newPlant;
  },
  
  editPlant: (plantId, updates) => {
    set((state) => ({
      plants: state.plants.map((p) =>
        p.id === plantId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  },
  
  deletePlant: (plantId) => {
    set((state) => ({ plants: state.plants.filter((p) => p.id !== plantId) }));
  },
  
  addContainer: (name, size) => {
    const newContainer = { id: uuidv4(), name, size, createdAt: new Date().toISOString() };
    set((state) => ({ containers: [...state.containers, newContainer] }));
    return newContainer;
  },
  
  addPhotos: (plantId, photoArray) => {
    set((state) => ({
      plants: state.plants.map((p) =>
        p.id === plantId ? { ...p, photos: [...p.photos, ...photoArray], updatedAt: new Date().toISOString() } : p
      ),
    }));
  },
  
  loadFromStorage: (data) => {
    if (data.plants) set({ plants: data.plants });
    if (data.containers) set({ containers: data.containers });
    if (data.indoorAreas) set({ indoorAreas: data.indoorAreas });
  },
  
  getState: () => {
    const state = get();
    return { plants: state.plants, containers: state.containers, indoorAreas: state.indoorAreas };
  },
}));

export default usePlantStore;