import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FileService } from './file.service';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, FileUploadComponent],
  bootstrap: [AppComponent],
  providers: [FileService]
})
export class AppModule {}
