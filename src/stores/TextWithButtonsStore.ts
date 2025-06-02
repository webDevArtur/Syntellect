import { makeAutoObservable } from "mobx";

export interface ButtonConfig {
  text: string;
  onClick: (store: TextWithButtonsStore) => void;
}

export class TextWithButtonsStore {
  value = "";
  leftButtons: ButtonConfig[] = [];
  rightButtons: ButtonConfig[] = [];

  constructor(leftButtons: ButtonConfig[] = [], rightButtons: ButtonConfig[] = []) {
    makeAutoObservable(this);
    this.leftButtons = leftButtons;
    this.rightButtons = rightButtons;
  }

  setValue(value: string) {
    this.value = value;
  }
}
