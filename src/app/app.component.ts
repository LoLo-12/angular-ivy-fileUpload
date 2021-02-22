import { Component, Input, VERSION } from "@angular/core";
import { DocumentContent } from "./file-upload/file-upload.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  @Input() fileType: DocumentContent;
}
