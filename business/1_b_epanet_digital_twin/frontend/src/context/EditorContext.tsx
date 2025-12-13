import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { LatLng } from '../utils/coordinateTransform';
import type { SnapCandidate } from '../utils/editorSnap';

export type SelectedKind =
  | 'junction'
  | 'pipe'
  | 'reservoir'
  | 'tank'
  | 'pump'
  | 'valve';

export type SelectedAsset = { kind: SelectedKind; id: string };

export type EditorMode =
  | 'select'
  | 'select-area'
  | 'junction'
  | 'reservoir'
  | 'tank'
  | 'pipe'
  | 'pump'
  | 'valve';

export type DraftLink =
  | {
      kind: 'pipe' | 'pump' | 'valve';
      points: LatLng[];
      startSnap?: SnapCandidate;
      endSnap?: SnapCandidate;
    }
  | null;

type EditorContextValue = {
  selected: SelectedAsset | null;
  setSelected: (next: SelectedAsset | null) => void;
  selectedArea: SelectedAsset[];
  setSelectedArea: (next: SelectedAsset[]) => void;
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  draftLink: DraftLink;
  setDraftLink: (next: DraftLink) => void;
};

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedAsset | null>(null);
  const [selectedArea, setSelectedArea] = useState<SelectedAsset[]>([]);
  const [mode, setMode] = useState<EditorMode>('select');
  const [draftLink, setDraftLink] = useState<DraftLink>(null);

  const value = useMemo(
    () => ({ selected, setSelected, selectedArea, setSelectedArea, mode, setMode, draftLink, setDraftLink }),
    [selected, selectedArea, mode, draftLink],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}

