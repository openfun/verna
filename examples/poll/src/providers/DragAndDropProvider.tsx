import { PropsWithChildren, useState, createContext, useContext } from 'react';

const DragAndDropContext = createContext<[boolean, (isDragging: boolean) => void]>([
  false,
  () => {},
]);

/**
 * A Provider to manage the active dnd through the app. By default, it uses the browser language.
 */
const DragAndDropProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return (
    <DragAndDropContext.Provider value={[isDragging, setIsDragging]}>
      {children}
    </DragAndDropContext.Provider>
  );
};

export const useDnd = () => {
  const context = useContext(DragAndDropContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default DragAndDropProvider;
