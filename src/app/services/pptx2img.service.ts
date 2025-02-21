import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pptx2imgService {
  private apiUrl='http://localhost:3001/api/files/';

  constructor(private http: HttpClient) { }
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size.toString());
    formData.append('fileType', file.type);


    return this.http.post(this.apiUrl+"upload", formData);
  }
  convertFile(fileName: string,fileFormat:string): Observable<any> {



    return this.http.post(this.apiUrl+"convert",{ fileName,fileFormat} );
  }





  // Méthode pour convertir un fichier
  convertFile1(fileName: string, fileFormat: string): Observable<any> {
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('fileFormat', fileFormat);

    // Laissez le navigateur définir automatiquement l'en-tête Content-Type
    return this.http.post(this.apiUrl + 'convert', formData);
  }
}
