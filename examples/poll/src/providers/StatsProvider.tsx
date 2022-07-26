import _ from 'lodash';
import { PropsWithChildren, useState, createContext, useContext, useEffect } from 'react';
import { statsData } from ':/data/formdata';

export type StatsType = Record<string, Record<string, Record<string, number>>>;

export interface StatsContextProps {
  pollsAnswered: Record<string, boolean>;
  reFetchLocalData: () => void;
  setPollsAnswered: (newValue: Record<string, boolean>) => void;
  setStats: (newValue: StatsType) => void;
  stats: StatsType;
}

const StatsContext = createContext<StatsContextProps>({
  pollsAnswered: {},
  reFetchLocalData: () => {},
  setPollsAnswered: () => {},
  setStats: () => {},
  stats: {},
});

/**
 * A Provider to manage the active dnd through the app. By default, it uses the browser language.
 */
const StatsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [stats, setStats] = useState(
    JSON.parse(localStorage.getItem('vernaExampleData-statsData') || '{}'),
  );
  const [pollsAnswered, setPollsAnswered] = useState(
    JSON.parse(localStorage.getItem('vernaExampleData-hasAnswered') || '{}'),
  );

  function reFetchLocalData() {
    setStats(statsData);
    setPollsAnswered({});
  }

  useEffect(() => {
    localStorage.setItem('vernaExampleData-statsData', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('vernaExampleData-hasAnswered', JSON.stringify(pollsAnswered));
  }, [pollsAnswered]);

  useEffect(() => {
    if (_.isEmpty(stats)) {
      reFetchLocalData();
    }
  }, []);

  return (
    <StatsContext.Provider
      value={{ pollsAnswered, reFetchLocalData, setPollsAnswered, setStats, stats }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStatsProvider = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsProvider must be used within a StatsProvider');
  }
  return context;
};

export default StatsProvider;
