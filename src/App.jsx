import { useState, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen';
import AreaScreen from './screens/AreaScreen';
import FilterScreen from './screens/FilterScreen';
import RadialScreen from './screens/RadialScreen';
import { categories, relationMatrix } from './data';

function buildDefaultFilters() {
  const f = {};
  for (const cat of categories) {
    f[cat.id] = {};
    for (const item of cat.items) {
      f[cat.id][item.id] = !cat.defaultExcluded?.includes(item.id);
    }
  }
  return f;
}

function App() {
  const [screen, setScreen] = useState('home');
  const [filters, setFilters] = useState(buildDefaultFilters);
  const [areaCritica, setAreaCritica] = useState('');

  const handleToggleItem = useCallback((catId, itemId) => {
    setFilters((prev) => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [itemId]: !prev[catId][itemId],
      },
    }));
  }, []);

  const handleSelectAll = useCallback((catId, value) => {
    setFilters((prev) => {
      const cat = categories.find((c) => c.id === catId);
      const next = { ...prev, [catId]: {} };
      for (const item of cat.items) {
        next[catId][item.id] = value;
      }
      return next;
    });
  }, []);

  const handleRecommendSelection = useCallback(() => {
    setFilters((prev) => {
      const next = { ...prev, tn: {} };
      const tnCat = categories.find((c) => c.id === 'tn');

      for (const item of tnCat.items) {
        next.tn[item.id] = false;
      }

      const mtCat = categories.find((c) => c.id === 'mt');
      for (const item of mtCat.items) {
        if (prev.mt[item.id]) {
          const connections = relationMatrix[item.id] || [];
          for (const connId of connections) {
            if (connId.startsWith('TN')) {
              next.tn[connId] = true;
            }
          }
        }
      }

      return next;
    });
  }, []);

  const handleGenerateRadial = useCallback(() => {
    setScreen('radial');
  }, []);

  return (
    <>
      {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
      {screen === 'area' && (
        <AreaScreen onNavigate={setScreen} onAreaSelect={setAreaCritica} />
      )}
      {screen === 'filters' && (
        <FilterScreen
          filters={filters}
          onToggleItem={handleToggleItem}
          onSelectAll={handleSelectAll}
          onRecommendSelection={handleRecommendSelection}
          onGenerateRadial={handleGenerateRadial}
          onBack={() => setScreen('area')}
          areaCritica={areaCritica}
        />
      )}
      {screen === 'radial' && (
        <RadialScreen filters={filters} onBack={() => setScreen('filters')} />
      )}
    </>
  );
}

export default App;
