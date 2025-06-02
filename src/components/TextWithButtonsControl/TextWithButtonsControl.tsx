import { observer } from "mobx-react-lite";
import { TextWithButtonsStore } from "../../stores/TextWithButtonsStore";
import styles from './TextWithButtonsControl.module.css';

interface Props {
  store: TextWithButtonsStore;
}

export const TextWithButtonsControl = observer(({ store }: Props) => (
  <div className={styles.wrapper}>
    {store.leftButtons.map((btn, i) => (
      <button key={"left" + i} className={styles.button} onClick={() => btn.onClick(store)}>
        {btn.text}
      </button>
    ))}

    <input
      type="text"
      value={store.value}
      onChange={e => store.setValue(e.target.value)}
      className={styles.input}
    />

    {store.rightButtons.map((btn, i) => (
      <button key={"right" + i} className={styles.button} onClick={() => btn.onClick(store)}>
        {btn.text}
      </button>
    ))}
  </div>
));
