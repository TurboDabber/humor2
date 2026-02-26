import { Component } from '@angular/core';
import { ImagesApiService, NextResponse } from '../../services/images-api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-play-page',
  imports: [],
  templateUrl: './play-page.html',
  styleUrl: './play-page.scss',
})
export class PlayPage {
  sessionId = '';
  state?: NextResponse;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ImagesApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') ?? '';
    if (!this.sessionId) {
      this.router.navigate(['/upload']);
      return;
    }
    this.loadNext();
  }

  loadNext() {
    this.error = '';
    this.loading = true;

    this.api.next(this.sessionId).subscribe({
      next: (res) => {
        this.state = res;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message ?? 'Download error';
      },
    });
  }

  finish() {
    this.router.navigate(['/upload']);
  }
}
