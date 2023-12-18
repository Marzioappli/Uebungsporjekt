import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [accessRights, setAccessRights] = useState([]);

  return (
    <UserContext.Provider value={{ accessRights, setAccessRights }}>
      {children}
    </UserContext.Provider>
  );
};
