import { createContext, useState, useContext, ReactNode } from 'react';

type TitleContextType = {
  title: ReactNode;
  setTitle: (title: ReactNode) => void;
};

const TitleContext = createContext<TitleContextType>({
  title: 'Title',
  setTitle: () => {},
});

export const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState<ReactNode>('Title');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);