import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LeveragePickerPage } from '../leverage-picker/leverage-picker.page';

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.css'],
    standalone: false,
})

export class Tab3Page implements OnInit, ViewWillEnter {
    is_dark_mode: boolean = false;
    leverage = 20; // default

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

        // ---- leverage ophalen ----
        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) {
            this.leverage = parseInt(tmp_leverage, 10);
        }
    }

    ionViewWillEnter(): void {
        const stored = localStorage.getItem('pref_dark_mode');
        this.is_dark_mode =
        stored !== null ? stored === 'true' : document.body.classList.contains('dark');

        const tmp_leverage = localStorage.getItem('pref_leverage');
        if (tmp_leverage !== null) this.leverage = parseInt(tmp_leverage, 10);
    }

    set_dark_mode(dark: boolean): void {
        localStorage.setItem('pref_dark_mode', String(dark));
        this.apply_theme(dark);
    }
    
    set_leverage(val: number): void {
        this.leverage = val;
        localStorage.setItem('pref_leverage', String(val));
    }

    private apply_theme(dark: boolean): void {
        document.body.classList.toggle('dark', dark);            // Ionic vars
        document.documentElement.classList.toggle('dark', dark); // Tailwind
        document.documentElement.setAttribute('color-theme', dark ? 'dark' : 'light');
    }

    constructor(private modalCtrl: ModalController) {}

    async openLeverage() {
        const modal = await this.modalCtrl.create({
            component: LeveragePickerPage,
            componentProps: { value: this.leverage, min: 1, max: 100, title: 'Edit Leverage' },
            breakpoints: [0, 0.4, 0.9],
            initialBreakpoint: 0.9, // voelt als een sheet zoals in je screenshot
        });

        modal.onDidDismiss().then(({ data }) => {
            if (typeof data === 'number') {
                this.leverage = data;
                localStorage.setItem('pref_leverage', String(data));   // ✅ HIER TOEVOEGEN
            }
        });

        await modal.present();
    }
}
