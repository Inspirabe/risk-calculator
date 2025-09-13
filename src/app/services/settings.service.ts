import { Injectable } from '@angular/core';

@Injectable({ 
    providedIn: 'root' 
})

export class SettingsService {

    constructor() { }

    capital: number = 1000;

    // lijst met platforms en fees
    platforms = [
        { id: 'bingx',   label: 'BingX',    maker_fee: 0.02, taker_fee: 0.05 }
    ];



    /** ========================================================================== */

    /**
	 * Determines whether the application is running on a mobile device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on a mobile device, otherwise false.
	 */
    isMobile = (): boolean =>
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) ||
		(navigator.userAgent.includes('Mac') && 'ontouchend' in document);

	/**
	 * Determines whether the application is running on an iOS device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on an iOS device, otherwise false.
	 */
	isIos = (): boolean =>
		/(iPad|iPhone|iPod)/g.test(navigator.userAgent);


}


