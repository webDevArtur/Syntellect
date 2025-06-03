import { makeAutoObservable, runInAction } from "mobx";

export interface Country {
  name: string;
  fullName: string;
  flag: string;
}

type GetCountryByNameFn = (name: string, signal?: AbortSignal) => Promise<Country[]>;

export class AutocompleteStore {
  value = "";
  suggestions: Country[] = [];
  isLoading = false;
  maxSuggestions: number;
  error: string | null = null;
  isSuggestionsVisible = false;

  private getCountryByName: GetCountryByNameFn;

  constructor(getCountryByName: GetCountryByNameFn, maxSuggestions: number) {
    makeAutoObservable(this);
    this.getCountryByName = getCountryByName;
    this.maxSuggestions = maxSuggestions;
  }

  setValue(value: string) {
    this.value = value;
  }

  showSuggestions() {
    this.isSuggestionsVisible = true;
  }

  hideSuggestions() {
    this.isSuggestionsVisible = false;
  }

  async fetchSuggestions(query: string, signal?: AbortSignal) {
    if (!query.trim()) {
      runInAction(() => {
        this.suggestions = [];
        this.error = null;
        this.isSuggestionsVisible = false;
      });
      return;
    }

    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const data = await this.getCountryByName(query, signal);

      const unique = new Map<string, Country>();
      
      data.forEach(item => {
        const key = `${item.name}_${item.fullName}_${item.flag}`;
        if (!unique.has(key)) unique.set(key, item);
      });
      
      runInAction(() => {
        this.suggestions = Array.from(unique.values()).slice(0, this.maxSuggestions);
        this.isSuggestionsVisible = true;
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Произошла ошибка при запросе. Попробуйте позже.";
        this.isSuggestionsVisible = false;
        console.error(err);
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  selectSuggestion(item: Country) {
    this.value = item.name.trim();
    this.suggestions = [];
    this.isSuggestionsVisible = false;
  }

  clearSuggestions() {
    this.suggestions = [];
    this.isSuggestionsVisible = false;
  }
}
