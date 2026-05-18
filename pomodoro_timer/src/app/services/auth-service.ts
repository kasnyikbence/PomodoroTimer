import { Injectable, signal, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, User } from '@angular/fire/auth';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private auth: Auth = inject(Auth);

  public currentUser = signal<string | null>(null);

  constructor() {
    authState(this.auth).subscribe((user: User | null) => {
      this.currentUser.set(user ? user.uid : null);
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  // Register
  async register(email: string, password: string): Promise<boolean> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  // Login
  async login(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}