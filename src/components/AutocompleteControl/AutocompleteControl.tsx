import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { AutocompleteStore } from "../../stores/AutocompleteStore";
import type { Country } from "../../stores/AutocompleteStore";
import styles from "./AutocompleteControl.module.css";
import { useAutocomplete } from "../../hooks/useAutocomplete";

interface Props {
  store: AutocompleteStore;
}

export const AutocompleteControl = observer(({ store }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { onInputChange, fetchSuggestions } = useAutocomplete(store);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        store.hideSuggestions();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [store]);

  const handleFocus = () => {
    if (store.value.trim() !== "") {
      if (store.suggestions.length > 0) {
        store.showSuggestions();
      } else {
        fetchSuggestions(store.value);
      }
    }
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <input
        type="text"
        value={store.value}
        onChange={e => onInputChange(e.target.value)}
        onFocus={handleFocus}
        className={styles.input}
        autoComplete="off"
      />

      {(store.isSuggestionsVisible && (store.suggestions.length > 0 || store.isLoading)) && (
        <ul className={styles.suggestions}>
          {store.isLoading && (
            <li className={styles.loadingItem}>
              <div className={styles.spinner} /> Загрузка...
            </li>
          )}

          {store.suggestions.map((item: Country, i) => (
            <li
              key={`${item.name}-${i}`}
              className={styles.item}
              onClick={() => store.selectSuggestion(item)}
            >
              {item.flag.startsWith("https") && (
                <img src={item.flag} alt={`${item.name} flag`} className={styles.flagImg} />
              )}

              <div>
                <div><b>{item.name}</b></div>
                
                <div style={{ fontSize: 12, color: "#666" }}>{item.fullName}</div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {store.error && (
        <span className={styles.errorItem}>{store.error}</span>
      )}
    </div>
  );
});
