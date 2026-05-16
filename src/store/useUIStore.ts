import { create } from 'zustand';

interface UIState {
  activeView: '2d' | '3d' | 'split';
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  aiPanelOpen: boolean;
  activeTool: 'select' | 'move' | 'rotate' | 'measure';
  
  setActiveView: (view: '2d' | '3d' | 'split') => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleBottomPanel: () => void;
  toggleAiPanel: () => void;
  setActiveTool: (tool: 'select' | 'move' | 'rotate' | 'measure') => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'split',
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomPanelOpen: false,
  aiPanelOpen: false,
  activeTool: 'select',

  setActiveView: (view) => set({ activeView: view }),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
