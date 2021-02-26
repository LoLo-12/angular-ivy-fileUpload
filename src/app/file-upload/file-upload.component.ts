import { EventEmitter } from "@angular/core";
import { Component, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import * as XLSX from "xlsx";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.css"]
})
export class FileUploadComponent implements OnInit {
  @Output() fileTypeEvent = new EventEmitter<DocumentContent>();
  constructor() {}

  ngOnInit() {
    this.fileTypeEvent.emit({
      fileType: "",
      fileContent: ""
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const type = event.target.files[0].type;
    if (type.includes("text")) {
      this.convertText(file).then(fileText => {
        this.fileTypeEvent.emit({
          fileType: type,
          fileContent: fileText
        });
      });
    }
    if (type.includes("excel")) {
      this.convertExcel(file).subscribe(fileText => {
        this.fileTypeEvent.emit({
          fileType: type,
          fileContent: fileText
        });
        console.log(fileText);
      });
    }
  }

  // 轉換成 base64
  convertFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  }

  // 讀取 .txt
  convertText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file, "big5");
    });
  }

  // 讀取 .xls
  convertExcel(file) {
    return new Observable(ob => {
      const reader = new FileReader();
      reader.onload = event => {
        // 使用 xlsx 來處理 excel
        const wb = XLSX.read(event.target.result, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        ob.next(data);
      };

      reader.onerror = () => {
        ob.error(reader.error);
      };

      reader.readAsBinaryString(file);
    });
  }
}

export interface ExcelSheetDto {
  keys: string[];
  data: any[];
}

export interface DocumentContent {
  fileType: string;
  fileContent: any;
}
