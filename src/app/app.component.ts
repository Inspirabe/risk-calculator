import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: false,
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
    const stored = localStorage.getItem('pref_dark_mode');
    let dark = stored !== null
      ? stored === 'true'
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.apply_theme(dark);

    // Optioneel: volg systeem als user geen keuze heeft
    if (stored === null && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', (e) => {
        this.apply_theme(e.matches);
      });
    }
  }

  private apply_theme(dark: boolean): void {
    document.body.classList.toggle('dark', dark);             // Ionic vars
    document.documentElement.classList.toggle('dark', dark);  // Tailwind
  }
}
