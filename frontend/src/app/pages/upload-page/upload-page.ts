import { Component, inject } from '@angular/core';
import { Router } from 'express';
import { ImagesApiService } from '../../services/images-api';

@Component({
  selector: 'app-upload-page',
  imports: [],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPage {
 files: File[] = [];
  uploading = false;
  error = '';
  private router = inject(Router); 
  private api = inject(ImagesApiService);


  onPick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.files = input.files ? Array.from(input.files) : [];
  }

  uploadAndGoNext() {
    this.error = '';
    if (!this.files.length) {
      this.error = 'Select at least 1 photo.';
      return;
    }

    this.uploading = true;
    this.api.uploadMany(this.files).subscribe({
      next: (res) => {
        this.uploading = false;
        this.router.navigate(['/play', res.sessionId]);
      },
      error: (e) => {
        this.uploading = false;
        this.error = e?.error?.message ?? 'Uploadu Error ';
      },
    });
  }
}
