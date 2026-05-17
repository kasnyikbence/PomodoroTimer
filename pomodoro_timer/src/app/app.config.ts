import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideServiceWorker } from "@angular/service-worker";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkv3M-EQ4MulXpcuQ_Dsxp9-zcjCFjj1M",
  authDomain: "pomodorotimer-ae466.firebaseapp.com",
  projectId: "pomodorotimer-ae466",
  storageBucket: "pomodorotimer-ae466.firebasestorage.app",
  messagingSenderId: "1038480303300",
  appId: "1:1038480303300:web:b908b5450e85ef720c5591"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideServiceWorker("ngsw-worker.js", {
      enabled: true,
      registrationStrategy: "registerImmediately",
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ],
};
