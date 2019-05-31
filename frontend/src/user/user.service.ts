import { Injectable } from "@angular/core";
import { AuthService } from "src/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { User } from "./user";
import { Observable } from "rxjs";
import { Consultant } from "src/consultant/consultant";
import { LocalStorageService } from "src/services/localStorage.service";
import { tap, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private user: User | null;
  private user$: Observable<User>;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private localStorage: LocalStorageService
  ) {
    this.init();
  }

  init() {
    this.user$ = this.authService.getUser();
    this.user = this.authService.getUserFromLocalStorage();
  }

  public getConsultants(user: User): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(
      `/api/users/${user._id}?getConsultants=true`
    );
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(`/api/users/${this.user._id}`);
  }

  public addConsultant(consultant: Consultant) {
    return this.user$.pipe(
      map(user => {
        if (
          this.findConsultant(consultant._id) === -1 &&
          !consultant.teamManager
        ) {
          user.consultants.push(consultant);
          this.localStorage.setItem("user", JSON.stringify(user));
          this.http
            .put<User>(
              `/api/users/add/${user._id}?consultantId=${consultant._id}`,
              {}
            )
            .subscribe();
        } else {
          throw new Error("This Consultant Belongs to Another Team");
        }
        return user;
      })
    );
  }

  public removeConsultant(consultant: Consultant) {
    return this.user$.pipe(
      map((user: User) => {
        user.consultants.splice(this.findConsultant(consultant._id), 1);
        this.localStorage.setItem("user", JSON.stringify(user));
        this.http
          .put<User>(
            `/api/users/remove/${user._id}?consultantId=${consultant._id}`,
            {}
          )
          .subscribe();
        return user;
      })
    );
  }

  createUser(user: User) {
    return this.http.post<User>("/api/users", user);
  }

  private findConsultant(consultantId: string) {
    let user = this.authService.getUserFromLocalStorage();
    let idx: number;
    idx = user.consultants.findIndex(el => el._id === consultantId);
    return idx;
  }
}
