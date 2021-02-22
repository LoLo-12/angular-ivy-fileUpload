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

  onFile(event) {
    const file = event.target.files[0];
    const type = event.target.files[0].type;
    this.convertWord(file).then(fileText => {
      this.fileTypeEvent.emit({
        fileType: type,
        fileContent: fileText
      });
    });
  }

  private checkFileType(type, file) {
    if (type.includes("excel")) {
      return this.convertText(file);
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
    });
  }

  // 讀取 .doc
  convertWord(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(reader.error);
      };
      const start = 0;
      const stop = file.size - 1;
      const blob = file.slice(start, stop + 1);
      // reader.readAsBinaryString(file);
      reader.readAsText(file, "big5");
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
