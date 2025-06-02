import { useMemo } from "react";
import { observer } from "mobx-react-lite";
import { TextWithButtonsStore } from "./stores/TextWithButtonsStore";
import { TextWithButtonsControl } from "./components/TextWithButtonsControl/TextWithButtonsControl";
import { AutocompleteStore } from "./stores/AutocompleteStore";
import { AutocompleteControl } from "./components/AutocompleteControl/AutocompleteControl";
import { getCountryByName } from "./api/apiService";
import { alertValue, checkNumber } from "./utils/textActions";
import styles from "./App.module.css";

const clearAndHelloButtons = {
  left: [],
  right: [
    { text: "Очистить", onClick: (s: TextWithButtonsStore) => s.setValue("") },
    { text: "Hello world!", onClick: (s: TextWithButtonsStore) => s.setValue("Hello world!") }
  ]
};

const checkAndAlertButtons = {
  left: [{ text: "Проверка на число", onClick: checkNumber }],
  right: [{ text: "Alert", onClick: alertValue }]
};

const App = observer(() => {
  const clearAndHelloControl = useMemo( () => new TextWithButtonsStore(clearAndHelloButtons.left, clearAndHelloButtons.right), []);
  const alertAndCheckControl = useMemo(() => new TextWithButtonsStore(checkAndAlertButtons.left, checkAndAlertButtons.right), []);

  const autocomplete3Limit = useMemo(() => new AutocompleteStore(getCountryByName, 3), []);
  const autocomplete10Limit = useMemo(() => new AutocompleteStore(getCountryByName, 10), []);

  return (
    <div className={styles.container}>
      <h3>Контрол с 2 кнопками справа</h3>
      <TextWithButtonsControl store={clearAndHelloControl} />

      <h3>Контрол с 1 кнопкой слева и 1 кнопкой справа</h3>
      <TextWithButtonsControl store={alertAndCheckControl} />

      <h3>Автокомплит (максимум 3 подсказки)</h3>
      <AutocompleteControl store={autocomplete3Limit} />

      <h3>Автокомплит (максимум 10 подсказок)</h3>
      <AutocompleteControl store={autocomplete10Limit} />
    </div>
  );
});

export default App;