import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type SelectedKind =
  | 'junction'
  | 'pipe'
  | 'reservoir'
  | 'tank'
  | 'pump'
  | 'valve';

export type SelectedAsset = { kind: SelectedKind; id: string };

type EditorContextValue = {
  selected: SelectedAsset | null;
  setSelected: (next: SelectedAsset | null) => void;
};

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedAsset | null>(null);

  const value = useMemo(
    () => ({ selected, setSelected }),
    [selected],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
