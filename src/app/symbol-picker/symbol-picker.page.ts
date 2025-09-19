import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController  } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-symbol-picker',
    templateUrl: './symbol-picker.page.html',
    styleUrls: ['./symbol-picker.page.css'],
    standalone: false,
})

export class SymbolPickerPage implements OnInit {
    symbols: { display: string; trade: string }[] = [];
    filtered: { display: string; trade: string }[] = [];
    searchTerm: string = '';

    loading = true;

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private settings: SettingsService
    ) {}

    async ngOnInit() {
        const loading = await this.loadingCtrl.create({
            message: 'Loading...',
            spinner: 'crescent' // or 'bubbles', 'dots', etc.
        });
        await loading.present();
        
        try {
            const markets = await this.settings.loadMarkets('USDT');
            // bewaar beide vormen
            this.symbols = markets.map(m => ({
                display: m.symbol?.replace(/:.*/, '') ?? '',
                trade: m.symbol ?? '',
            }));

            this.filtered = [...this.symbols];
        } catch (err) {
            console.error('Error loading markets', err);
        } finally {
            this.loading = false;
            loading.dismiss();
        }
    }

    onSearch(ev: any) {
        const term = (ev.detail.value || '').toLowerCase();
        this.filtered = this.symbols.filter(s => 
            s.display.toLowerCase().includes(term)
        );
    }

    selectSymbol(symbol: { display: string; trade: string }) {
        this.settings.setSymbol(symbol);
        this.modalCtrl.dismiss(symbol.display);
    }

    close() {
        this.modalCtrl.dismiss(null);
    }
}
