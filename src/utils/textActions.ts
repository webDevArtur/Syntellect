import { TextWithButtonsStore } from "../stores/TextWithButtonsStore";

export const alertValue = (store: TextWithButtonsStore) => {
  if (store.value.trim() === "") return alert("Значение пусто");

  alert(store.value);
};

export const checkNumber = (store: TextWithButtonsStore) => {
  const error = validateNumber(store.value);

  if (error) {
    alert(error);
  } else {
    alert(`Число: ${store.value.trim()}`);
  }
};

const validateNumber = (val: string): string | null => {
  const trimmed = val.trim();
  
  if (trimmed === "") return "Значение пусто";

  if (isNaN(Number(trimmed))) return "Введено не число";
  return null;
};
