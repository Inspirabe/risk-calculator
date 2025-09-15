import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.css'],
  standalone: false,
})
export class TabsPage implements OnInit {

    isMobile: boolean = false;

    constructor(
        public settings: SettingsService,
        private http: HttpClient
    ) {}

    async ngOnInit(): Promise<void> {
        let tmp_capital = localStorage.getItem('capital');
        if (tmp_capital !== null) {
            this.settings.capital = parseInt(tmp_capital, 10);
        }

        let headers: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer d5f8645c957d61e6990f4649590308e84e726107827c008d2a41dbb9fb16200b475658fccce0e7e582c37515e8765c81b6b82120871e110c3b83b924cc9aa60246506d0ebeda9879c0181f3e4fa6cbc3c352921b6bd8450e10d2642bb7078ebd1863d4c1d44f4bb66faa5db76750f787ffe8a9335b6729990bd6de3c1435574f29e0cd46cec9301e577928c517b2fd2a2255b439600a6d9cae2f3611c3bccc4bd74bb34da33e3cc8eb134d72c4c20c28642b70a88e7e72e294d7a5ae846b8858660e173674796d1e875b5bdf47179f2be1bde70673ffd8dc31ecfc742b5365cb9772ebbea959167085f96f3e484ee3002b2685b792ae30a822684ec5d3c1b472486192325e1b379e293449a6e4b1ef95bcc426e0762de67ac21beca434a970b79b129c6b51d89fa5b11d92381c0847d629fa90028d752735298f52e7d84c349edf9967424adeb05e906501369ca3c5102487355561ba3881ff451ede7786d562f0e7770ec236ca0339844d42693fe949ffbd73add81de5c0950c9d0646bdbb04817f144f06de6ccf21009b8683ba349560f4b1c8d48d739971d15eed81b194164f026a39976faaf1535eed6123d351192ec1e83b1e01dab18b19909433286b2e01a86f74f28bac9373b66e01e5570d50234c954b84633fe2ce3a4488f86648d257a9a6536c72dadd8534da75a14a8f639469bbce8d9c6bffba8defeee90a58cd5d40fb62e1800413943664afffb5bff69df63a1c06926e92e460846d44193f1d411b7aeba2a76ec85af461300fc2b16d7fcb12490c15ef56918d3c9b7d7d73de55ee247cd9c02d2a0f8034213ce9ede3e8641bb0327f09db6ff418c4e59d275a54dded9e4755a288d555c7ac7c1b42cad86f738adc286d1cf4c8812809407f03f6f556213a0c028dbf15715559210c4de6f41dcb0bb6a6a133fab8a5e7d12f7b77deffdcc5e92913f85bb0f8801392cd4a2d2021dd2516021e21c39d2259713fafa333df07824cc77745d90bf81465188af3365fc4b842d9dd629225ba9a0fa6332ef2132d2fc5816a6d6c9822cfa207e862597852a3e335dd0248f9c322ea04c9e163a28ae3792b551898bf8fb7d59004b680b2b71799d1212ab864e59a7da4b31c0928c6cc2e91b89eb25334f911cc8d433586f57bdfeaaa853fdc812e048e8addcc6b5173cd70da140124fe5bdcd38628b81b53635a579d5efcc6cdc9590e270a77a95016f62acb737724f8ad1e177ee636be7d420e67e80d2c2710a88312302df4e7a61326ab45fc978cfb63f357534396d7223d22b33157a751165a947d325efb63c7749d684e8911271e39cb665558e2d7376b7c6ecbc265d7eba9c5ba10a06332e72913a7d8dd51808e0ce1242a31b73bfebf16e0ae60e6ca116f3ad2dde1ecf19abd8948');
        let url:string = 'https://api.riskcalculator.tegridy.capital/v1/platform/';

        try {
            this.settings.platforms = await firstValueFrom(
                this.http.get<platform[]>(url, {headers})
            );
        } catch (err) {
            console.error('Error fetching platforms:', err);
        }
    }
}

export interface platform{
    id: string,
    label: string,
    maker_fee: number,
    taker_fee: number
}