import { Component, OnInit, ViewChild } from "@angular/core";
import { ConsultantService } from "./consultant.service";
import { Consultant } from "./consultant";
import { Observable, Subscription, Subject } from "rxjs";
import { Router } from "@angular/router";
import { ConsultantCreateComponent } from "./consultant-create/consultant-create.component";
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
  MatSort,
  MatSnackBar
} from "@angular/material";
import { AuthService } from "src/services/auth.service";
import { UserService } from "../user/user.service";

@Component({
  selector: "app-consultant",
  templateUrl: "./consultant.component.html",
  styleUrls: ["../shared/styles/consultant.component.scss"]
})
export class ConsultantComponent implements OnInit {
  public consultant: Consultant = new Consultant();
  public consultants$: Observable<Consultant[]>;
  public consultantsSub: Subscription;
  public tableHeaders: string[] = [
    "lastName",
    "firstName",
    "role",
    "title",
    "email",
    "addToTeam"
  ];

  dataSource = new MatTableDataSource<Consultant>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public loggedInUserSub: Subscription;
  public userId: string;

  constructor(
    private consultantService: ConsultantService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getConsultants();
    this.consultantsSub = this.consultants$.subscribe(results => {
      this.dataSource.data = results;
    });
    this.loggedInUserSub = this.authService.getUser().subscribe(result => {
      this.userId = result._id;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.loggedInUserSub && this.loggedInUserSub.unsubscribe();
    this.consultantsSub && this.consultantsSub.unsubscribe();
  }

  getConsultants(): void {
    this.consultants$ = this.consultantService.getConsultants();
  }

  updateConsultants(): void {
    this.consultantService.getConsultants().subscribe(results => {
      this.dataSource.data = results;
    });
  }

  addToTeam(e: Event, consultant: Consultant) {
    e.stopPropagation();
    this.userService.addConsultant(consultant).subscribe(
      () => {
        this.snackbar.open("Added to Team", "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["green-snackbar"]
        });
        this.updateConsultants();
      },
      err => {
        this.snackbar.open(err.message, "", {
          duration: 3000,
          verticalPosition: "top"
        });
        this.updateConsultants();
      }
    );
  }

  removeFromTeam(e: Event, consultant: Consultant): void {
    e.stopPropagation();
    this.userService.removeConsultant(consultant).subscribe(
      () => {
        this.snackbar.open("Removed from Team", "", {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"]
        });
        this.updateConsultants();
      },
      err => {
        this.snackbar.open(err.message, "", {
          duration: 3000,
          verticalPosition: "top"
        });
        this.updateConsultants();
      }
    );
  }

  goToConsultant(consultant: Consultant): void {
    this.router.navigate([`consultants/${consultant._id}`]);
  }

  public createConsultant(): void {
    let dialog = this.dialog.open(ConsultantCreateComponent);
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.consultantService
          .createConsultant(result)
          .subscribe(consultant => {
            this.router.navigate([`consultants/${consultant._id}`]);
          });
      }
    });
  }

  private noResults$ = new Subject<boolean>();

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.noResults$.next(this.dataSource.filteredData.length === 0);
  }
}
