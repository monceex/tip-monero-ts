import { createContext, useState, useContext } from 'react';

type NavbarButtonContextType = {
  icon: React.ReactNode;
  onClick: () => void; 
  setButton: (icon: React.ReactNode, onClick: () => void) => void;
};

const NavbarButtonContext = createContext<NavbarButtonContextType>({
  icon: null,
  onClick: () => {},
  setButton: () => {},
});

export const NavbarButtonProvider = ({ children }: { children: React.ReactNode }) => {
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [onClick, setOnClick] = useState<() => void>(() => {});

  const setButton = (newIcon: React.ReactNode, newOnClick: () => void) => {
    setIcon(newIcon);
    setOnClick(() => newOnClick);
  };

  return (
    <NavbarButtonContext.Provider value={{ icon, onClick, setButton }}>
      {children}
    </NavbarButtonContext.Provider>
  );
};

export const useNavbarButton = () => useContext(NavbarButtonContext);