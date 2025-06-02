import { useEffect, useRef } from "react";

interface AutocompleteStore {
  fetchSuggestions: (value: string, signal: AbortSignal) => Promise<void>;
  setValue: (value: string) => void;
  clearSuggestions: () => void;
}

export function useAutocomplete(store: AutocompleteStore, delay = 400) {
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchSuggestions = (value: string) => {
    if (abortController.current) abortController.current.abort();
    
    abortController.current = new AbortController();
    const signal = abortController.current.signal;

    store.fetchSuggestions(value, signal).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;

      if (error instanceof Error) {
        console.error("Ошибка:", error.message);
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    });
  };

  const onInputChange = (value: string) => {
    store.setValue(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.trim() === "") {
        store.clearSuggestions();
      } else {
        fetchSuggestions(value);
      }
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  return { onInputChange, fetchSuggestions };
}
