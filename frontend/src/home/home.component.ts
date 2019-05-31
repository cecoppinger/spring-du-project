import { Component } from "@angular/core";
import { User } from "../app/models/user";
import { Credentials } from "../app/models/credentials";
import { Router } from "@angular/router";
import { AuthService } from "src/services/auth.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["../shared/styles/home.scss"]
})
export class HomeComponent {
  public loggedInUser: User;
  public credentials: Credentials = new Credentials();

  constructor(
    public router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  public async login(): Promise<void> {
    if (this.credentials.username && this.credentials.password) {
      try {
        await this.authService.login(this.credentials);
        this.router.navigate(["user"]);
      } catch (e) {
        this.snackBar.open("Invalid Login", "", {
          duration: 3000,
          verticalPosition: "top"
        });
      }
    }
  }
}
