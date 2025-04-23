"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AssistantStateContextType {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  inputFocused: boolean;
  setInputFocused: (inputFocused: boolean) => void;
}

const AssistantStateContext = createContext<AssistantStateContextType | undefined>(undefined);

export const AssistantStateProvider = ({ children }: {children: ReactNode}) => {
  const [expanded, setExpanded] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const assistantState: AssistantStateContextType = {
    expanded,
    setExpanded,
    inputFocused,
    setInputFocused,
  };

  return (
    <AssistantStateContext.Provider value={assistantState}>
      {children}
    </AssistantStateContext.Provider>
  );
};

export const useAssistantState = (): AssistantStateContextType => {
  const context = useContext(AssistantStateContext);
  if (context === undefined) {
    throw new Error('useAssistantState must be used within an AssistantStateProvider');
  }
  return context;
};
