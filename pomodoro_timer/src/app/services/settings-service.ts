import { Injectable, signal, inject } from "@angular/core";
import { AuthService } from './auth-service';
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";


@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  private db!: IDBDatabase;
  private readonly objectStoreName = "settings";

  public focusTime = signal(25);
  public shortBreakTime = signal(5);
  public longBreakTime = signal(15);

  constructor() {
    this.initIndexedDB();

    window.addEventListener('online', () => {
      console.log("Visszajött az internet, adatok szinkronizálása a felhőbe...");
      this.syncToFirebase();
    });
  }

  private initIndexedDB(): void {
    const request = indexedDB.open("settings-db", 1);
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      db.createObjectStore(this.objectStoreName, { keyPath: "id" });
    };
    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      this.loadSettings();
    };
  }

loadSettings() {
    const uid = this.authService.currentUser();
    
    const storageId = uid ? uid : 'guest'; 

    const objectStore = this.db.transaction(this.objectStoreName).objectStore(this.objectStoreName);
    const result = objectStore.get(storageId);

    result.onsuccess = (event: any) => {
      const settings = event.target.result;
      if (settings) {
        this.focusTime.set(settings.focusTime);
        this.shortBreakTime.set(settings.shortBreakTime);
        this.longBreakTime.set(settings.longBreakTime);
      } else {
        this.focusTime.set(25);
        this.shortBreakTime.set(5);
        this.longBreakTime.set(15);
      }
      
      if (navigator.onLine && uid) {
        this.syncFromFirebase();
      }
    };
  }

updateSettings(focusTime: number, shortBreakTime: number, longBreakTime: number) {
    const uid = this.authService.currentUser();
    const storageId = uid ? uid : 'guest';

    this.focusTime.set(focusTime);
    this.shortBreakTime.set(shortBreakTime);
    this.longBreakTime.set(longBreakTime);

    const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
    objectStore.put({ id: storageId, focusTime, shortBreakTime, longBreakTime });

    if (navigator.onLine && uid) {
      this.syncToFirebase();
    }
  }


private async syncFromFirebase() {
    const uid = this.authService.currentUser();
    if (!uid) return;

    try {
      const docRef = doc(this.firestore, `users/${uid}/settings/timer`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cloudSettings = docSnap.data();
        
        this.focusTime.set(cloudSettings['focusTime']);
        this.shortBreakTime.set(cloudSettings['shortBreakTime']);
        this.longBreakTime.set(cloudSettings['longBreakTime']);

        const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
        objectStore.put({ 
          id: uid, 
          focusTime: cloudSettings['focusTime'], 
          shortBreakTime: cloudSettings['shortBreakTime'], 
          longBreakTime: cloudSettings['longBreakTime'] 
        });
        console.log("Sikeres szinkronizáció!");
      }
    } catch (error) {
      console.error("Hiba a Firebase letöltéskor:", error);
    }
  }

private async syncToFirebase() {
    const uid = this.authService.currentUser();
    if (!uid) return;

    try {
      const docRef = doc(this.firestore, `users/${uid}/settings/timer`);
      await setDoc(docRef, { 
        focusTime: this.focusTime(), 
        shortBreakTime: this.shortBreakTime(), 
        longBreakTime: this.longBreakTime() 
      }, { merge: true });
      console.log("Sikeres szinkronizáció!");
    } catch (error) {
      console.error("Hiba a Firebase feltöltéskor:", error);
    }
  }
}