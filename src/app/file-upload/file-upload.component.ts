import { EventEmitter } from "@angular/core";
import { Component, OnInit, Output } from "@angular/core";
import * as XLSX from "xlsx";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.css"]
})
export class FileUploadComponent implements OnInit {
  @Output() fileTypeEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  onFile(event) {
    const file = event.target.files[0];
    const type = event.target.files[0].type;
    this.fileTypeEvent.emit(type);
    this.convertText(file).then(fileText => {
      console.log(fileText);
    });
  }

  // 檔案轉換成 base64
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

  // 讀取檔案內容
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

  // 讀取 excel
  convertExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        // 使用 xlsx 來處理 excel
        const wb = XLSX.read(event.target.result, { type: "binary" });
      };
    });
  }
}
