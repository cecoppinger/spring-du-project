import { Component, OnInit, Inject } from "@angular/core";
import { ConsultantComment } from "../comment";
@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["../../shared/styles/comment.scss"]
})
export class CommentComponent implements OnInit {
  public comment: ConsultantComment = new ConsultantComment();

  constructor() {}

  ngOnInit() {}
}
