import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-symbol-picker',
    templateUrl: './symbol-picker.page.html',
    styleUrls: ['./symbol-picker.page.css'],
    standalone: false,
})

export class SymbolPickerPage implements OnInit {
    symbols: string[] = [];
    filtered: string[] = [];
    searchTerm: string = '';

    loading = true;

    constructor(
        private modalCtrl: ModalController,
        private settings: SettingsService
    ) {}

    async ngOnInit() {
        try {
            const markets = await this.settings.loadMarkets('USDT');
            console.log('Markets response:', markets);

            // neem symbol en verwijder ":USDT"
            this.symbols = markets
                .map(m => m.symbol?.replace(/:.*/, '') ?? '')
                .filter(s => s.length > 0);

            this.filtered = [...this.symbols];
        } catch (err) {
            console.error('Error loading markets', err);
        } finally {
            this.loading = false;
        }
    }

    onSearch(ev: any) {
        const term = (ev.detail.value || '').toLowerCase();
        this.filtered = this.symbols.filter(s => s.toLowerCase().includes(term));
    }

    selectSymbol(symbol: string) {
        this.modalCtrl.dismiss(symbol);
    }

    close() {
        this.modalCtrl.dismiss(null);
    }
}
