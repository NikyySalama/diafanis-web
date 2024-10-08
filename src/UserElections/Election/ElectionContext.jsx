import React, { createContext, useContext } from 'react';

const ElectionContext = createContext();

export const useElection = () => useContext(ElectionContext);

export const ElectionProvider = ({ children, electionId, electionEditable }) => {

  const value = {
    electionId,
    electionEditable,
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};