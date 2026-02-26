import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UploadResponse {
  sessionId: string;
  total: number;
}

export interface NextResponse {
  done: boolean;
  remaining: number;
  image?: { id: string; url: string; originalName: string };
}

@Injectable({
  providedIn: 'root',
})
export class ImagesApiService {
    private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  uploadMany(files: File[]): Observable<UploadResponse> {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, form);
  }

  next(sessionId: string): Observable<NextResponse> {
    return this.http.get<NextResponse>(`${this.baseUrl}/sessions/${sessionId}/next`);
  }
}
