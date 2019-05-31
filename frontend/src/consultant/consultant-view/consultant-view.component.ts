import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Consultant } from "../consultant";
import { ConsultantService } from "../consultant.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { CommentComponent } from "../comment/comment.component";
import { ConsultantComment } from "../comment";
import { DeleteComponent } from "../delete/delete.component";
import { UserService } from "src/user/user.service";
import { AuthService } from "src/services/auth.service";

@Component({
  selector: "app-consultant-view",
  templateUrl: "./consultant-view.component.html",
  styleUrls: ["../../shared/styles/comment.scss"]
})
export class ConsultantViewComponent implements OnInit {
  public consultant: Consultant;
  private id: string = this.route.snapshot.paramMap.get("id");
  private tmId: string = "none";
  public delete: boolean = false;
  public userSub: Subscription;
  public onTeam: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private consultantService: ConsultantService,
    public dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updateConsultant();
  }

  ngOnDestroy(): void {
    this.userSub && this.userSub.unsubscribe();
  }

  updateConsultant() {
    this.consultantService.getConsultantById(this.id).subscribe(result => {
      this.consultant = result;
      if (this.consultant.teamManager) {
        this.tmId = this.consultant.teamManager._id;
      }
      this.authService.getUser().subscribe(user => {
        if (user && this.tmId === user._id) {
          this.onTeam = true;
        }
      });
    });
  }

  deleteConsultant(id: string): void {
    let dialog = this.dialog.open(DeleteComponent);
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.consultantService.deleteConsultant(id).subscribe();
        this.router.navigate(["/consultants"]);
      }
    });
  }

  removeFromTeam(consultant: Consultant) {
    let dialogRef = this.dialog.open(DeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.removeConsultant(consultant).subscribe(result => {
          this.router.navigate(["user"]);
        });
      }
    });
  }

  addToTeam() {
    this.userService.addConsultant(this.consultant).subscribe(() => {
      this.snackbar.open("Added to Team", "", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["green-snackbar"]
      });
      this.router.navigate(["consultants"]);
    });
  }

  addComment(): void {
    let dialog = this.dialog.open(CommentComponent, {
      width: "500px",
      height: "400px"
    });
    dialog.afterClosed().subscribe((result: ConsultantComment) => {
      if (result.text) {
        this.consultantService.addComment(this.id, result).subscribe(result => {
          this.consultant = result;
        });
      }
    });
  }
}
