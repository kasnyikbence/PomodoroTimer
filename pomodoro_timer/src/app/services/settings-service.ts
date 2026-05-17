import { Injectable, Input, input, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private db!: IDBDatabase;
  private readonly objectStoreName = "settings";

  public focusTime = signal(25);
  public shortBreakTime = signal(5);
  public longBreakTime = signal(15);

  constructor() {
    this.initIndexedDB();
  }

  private initIndexedDB(): void {
    // Adatbázis létrehozása (ha még nem létezik) és megnyitása
    const request = indexedDB.open("settings-db", 1);

    // Error kezelése az adatbázis létrehozásakor/megnyitásakor
    request.onerror = (event: any) => {
      console.log("Database error: ", event.target.error);
    };

    // Ha a verziószám növekedett (vagy most hoztuk létre az adatbázist), itt kell frissíteni az object store sémát
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;

      // Object store létrehozása
      const objectStore = db.createObjectStore(this.objectStoreName, { keyPath: "id" });
    };

    // Adatbázis sikeres létrehozásának&megnyitásának kezelése
    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadSettings();
    };
  }

  //betöltés
  loadSettings() {
    const objectStore = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName);
    const result = objectStore.get(1);

    result.onsuccess = (event: any) => {
      const settings = event.target.result;
      if (settings) {
        this.focusTime.set(settings.focusTime);
        this.shortBreakTime.set(settings.shortBreakTime);
        this.longBreakTime.set(settings.longBreakTime);
      }
    };
  }

  //frissítés
  updateSettings(focusTime: number, shortBreakTime: number, longBreakTime: number) {
    this.focusTime.set(focusTime);
    this.shortBreakTime.set(shortBreakTime);
    this.longBreakTime.set(longBreakTime);

    const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
    const request = objectStore.put({ id: 1, focusTime, shortBreakTime, longBreakTime });

    request.onsuccess = () => {
      console.log("Settings updated in IndexedDB");
    };

    request.onerror = (event: any) => {
      console.log("Error updating settings: ", event.target.error);
    };
  }
}
