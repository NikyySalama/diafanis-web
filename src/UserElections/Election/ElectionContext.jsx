import React, { createContext, useContext } from 'react';

const ElectionContext = createContext();

export const useElection = () => useContext(ElectionContext);

export const ElectionProvider = ({ children, electionId }) => {
  return (
    <ElectionContext.Provider value={electionId}>
      {children}
    </ElectionContext.Provider>
  );
};
