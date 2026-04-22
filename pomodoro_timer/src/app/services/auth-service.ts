import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  public currentUser = signal<string | null>(localStorage.getItem("currentUser"));

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  //register
  register(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((user: { email: string }) => user.email === email);
    if (userExists) {
      return false;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  //login
  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((user: { email: string; password: string }) => user.email === email && user.password === password);
    if (user) {
      this.currentUser.set(email);
      localStorage.setItem("currentUser", email);
      return true;
    }
    return false;
  }

  //logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem("currentUser");
  }
}
