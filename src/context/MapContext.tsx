import React, { SetStateAction } from "react";

/*
export const MapContext = React.createContext<{
  checked: boolean;
  setChecked: (checked: boolean) => void;
}>({
  checked: false,
  setChecked: () => {},
});

 */
export const MapContext = React.createContext({
  checked: false,
  setChecked: (checked: SetStateAction<boolean>) => {},
});
