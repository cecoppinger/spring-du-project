import { Component, OnInit, Input } from "@angular/core";
import { ConsultantService } from "./consultant.service";
import { Consultant } from "./consultant";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ConsultantCreateComponent } from "./consultant-create/consultant-create.component";
import { MatDialog } from "@angular/material";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-consultant",
  templateUrl: "./consultant.component.html",
  styleUrls: ["../shared/styles/consultant.component.scss"]
})
export class ConsultantComponent implements OnInit {
  public consultant: Consultant = new Consultant();
  public consultants$: Observable<Consultant[]>;
  public consultants: Consultant[];
  public tableHeaders: string[] = [
    "last name",
    "first name",
    "role",
    "title",
    "email",
    "addToTeam"
  ];
  public loggedInUserSub: Subscription;

  constructor(
    private consultantService: ConsultantService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.consultantService.getConsultants().subscribe(result => {
      this.consultants = result;
    });
    this.loggedInUserSub = this.authService.getUser().subscribe();
  }

  getConsultants(): void {
    this.consultants$ = this.consultantService.getConsultants();
  }

  goToConsultant(consultantId: string): void {
    this.router.navigate([`consultants/${consultantId}`]);
    console.log(consultantId);
  }

  public createConsultant(): void {
    let dialog = this.dialog.open(ConsultantCreateComponent);
    dialog.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.consultantService
          .createConsultant(result)
          .subscribe(consultant => {
            this.router.navigate([`consultants/${consultant._id}`]);
          });
      }
    });
  }
}
