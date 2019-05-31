import { Component, OnInit, ViewChild } from "@angular/core";
import { Consultant } from "src/consultant/consultant";
import { UserService } from "./user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription, Subject } from "rxjs";
import { AuthService } from "src/services/auth.service";
import { User } from "./user";
import { MatTableDataSource, MatSort, MatSnackBar } from "@angular/material";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["../shared/styles/consultant.component.scss"]
})
export class UserComponent implements OnInit {
  public consultants: Consultant[];
  public consultants$: Observable<Consultant[]>;
  public user$: Observable<User>;
  private userSub: Subscription;
  public tableHeaders: string[] = [
    "lastName",
    "firstName",
    "role",
    "title",
    "email"
  ];

  dataSource = new MatTableDataSource<Consultant>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUser();
    this.userSub = this.user$.subscribe(user => {
      this.dataSource.data = user.consultants;
    });
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.userSub && this.userSub.unsubscribe();
  }

  getUser() {
    this.user$ = this.authService.getUser();
  }

  goToConsultant(consultant: Consultant): void {
    this.router.navigate([`consultants/${consultant._id}`]);
  }

  removeFromTeam(e: Event, consultant: Consultant): void {
    e.stopPropagation();
    this.userService.removeConsultant(consultant).subscribe(
      user => {
        this.consultants = user.consultants;
        this.dataSource.data = this.consultants;
        console.log(this.consultants);

        this.snackbar.open("Removed from Team", "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"]
        });
      },
      err => {
        this.snackbar.open(err.message, "", {
          duration: 3000,
          verticalPosition: "top"
        });
      }
    );
  }

  private noResults$ = new Subject<boolean>();

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.noResults$.next(this.dataSource.filteredData.length === 0);
  }
}
