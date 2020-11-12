import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//const baseUrl = 'http://ec2-3-82-60-134.compute-1.amazonaws.com:8080/api/cards';
const baseUrl = 'http://localhost:8080/api/cards';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(baseUrl);
  }

  get(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByName(title): Observable<any> {
    return this.http.get(`${baseUrl}?name=${title}`);
  }

  findByGameCode(gameCode): Observable<any> {
    const data = {
      code: gameCode
    };
    return this.http.post(baseUrl + '/find/code', data);
  }

  sendEmail(data): Observable<any> {
    const dataToSend = {
      emailTo: data.emailTo,
      message: data.message,
      subject: data.subject
    };
    return this.http.post(baseUrl + '/send/email', dataToSend);
  }

}

