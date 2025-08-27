import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.css'],
  standalone: false,
})
export class Tab3Page implements OnInit, ViewWillEnter {
  is_dark_mode: boolean = false;

  ngOnInit(): void {
    const stored = localStorage.getItem('pref_dark_mode');
    if (stored !== null) {
      this.is_dark_mode = stored === 'true';
    } else {
      this.is_dark_mode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    this.apply_theme(this.is_dark_mode);

    if (stored === null && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener?.('change', (e) => {
        this.is_dark_mode = e.matches;
        this.apply_theme(this.is_dark_mode);
      });
    }
  }

  ionViewWillEnter(): void {
    const stored = localStorage.getItem('pref_dark_mode');
    this.is_dark_mode =
      stored !== null ? stored === 'true' : document.body.classList.contains('dark');
  }

  set_dark_mode(dark: boolean): void {
    localStorage.setItem('pref_dark_mode', String(dark));
    this.apply_theme(dark);
  }

  private apply_theme(dark: boolean): void {
    document.body.classList.toggle('dark', dark);            // Ionic vars
    document.documentElement.classList.toggle('dark', dark); // Tailwind
    document.documentElement.setAttribute('color-theme', dark ? 'dark' : 'light');
  }
}
