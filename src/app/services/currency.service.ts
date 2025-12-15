import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError, switchMap, startWith } from 'rxjs/operators';

export interface CurrencyRate {
  currency: string;
  rate: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currencyRatesSubject = new BehaviorSubject<CurrencyRate[]>([]);
  public currencyRates$ = this.currencyRatesSubject.asObservable();

  // Use Angular proxy to avoid CORS issues - this will proxy through server
  private readonly CURRENCY_API_URL = '/api/currency-rates';

  constructor(private http: HttpClient) {}

  // Get real-time currency rates
  getCurrencyRates(): Observable<CurrencyRate[]> {
    return this.http.get<any>(this.CURRENCY_API_URL).pipe(
      map(response => {
        console.log('Currency API Response:', response);
        const rates: CurrencyRate[] = [];
        
        // API response format: { rates: { USD: 0.00353, EUR: 0.00304, ... }, base: "PKR", date: "2025-10-22" }
        if (response.rates) {
          Object.keys(response.rates).forEach(currency => {
            if (currency !== 'PKR' && typeof response.rates[currency] === 'number') {
              rates.push({
                currency: currency,
                rate: response.rates[currency],
                name: this.getCurrencyName(currency)
              });
            }
          });
        }
        
        // Sort by currency name for better display
        rates.sort((a, b) => a.name.localeCompare(b.name));
        
        this.currencyRatesSubject.next(rates);
        console.log('✅ Live currency rates processed:', rates.length, 'currencies');
        return rates;
      }),
      catchError(error => {
        console.error('Error fetching live currency rates:', error);
        console.log('Using fallback rates...');
        // Return fallback data if API fails
        return this.getFallbackCurrencyRates();
      })
    );
  }

  // Fallback to backend API
  private getBackendCurrencyRates(): Observable<CurrencyRate[]> {
    // This would need to be implemented to call your existing backend
    // For now, return the fallback rates
    return this.getFallbackCurrencyRates();
  }

  // Get currency rates with auto-refresh every 30 minutes
  getCurrencyRatesWithRefresh(): Observable<CurrencyRate[]> {
    return interval(30 * 60 * 1000) // Refresh every 30 minutes
      .pipe(
        startWith(0), // Start immediately
        switchMap(() => this.getCurrencyRates())
      );
  }

  // Fallback currency rates (updated to match current live rates)
  private getFallbackCurrencyRates(): Observable<CurrencyRate[]> {
    const fallbackRates: CurrencyRate[] = [
      { currency: 'USD', rate: 0.00353, name: 'United States Dollar' },
      { currency: 'EUR', rate: 0.00304, name: 'Euro' },
      { currency: 'GBP', rate: 0.00264, name: 'British Pound' },
      { currency: 'AED', rate: 0.013, name: 'UAE Dirham' },
      { currency: 'SAR', rate: 0.0132, name: 'Saudi Riyal' },
      { currency: 'BDT', rate: 0.431, name: 'Bangladeshi Taka' },
      { currency: 'INR', rate: 0.311, name: 'Indian Rupee' },
      { currency: 'CNY', rate: 0.025, name: 'Chinese Yuan' },
      { currency: 'JPY', rate: 0.536, name: 'Japanese Yen' },
      { currency: 'CAD', rate: 0.00495, name: 'Canadian Dollar' },
      { currency: 'AUD', rate: 0.00544, name: 'Australian Dollar' },
      { currency: 'CHF', rate: 0.00281, name: 'Swiss Franc' },
      { currency: 'SEK', rate: 0.0333, name: 'Swedish Krona' },
      { currency: 'NOK', rate: 0.0355, name: 'Norwegian Krone' },
      { currency: 'DKK', rate: 0.0227, name: 'Danish Krone' },
      { currency: 'PLN', rate: 0.0129, name: 'Polish Zloty' },
      { currency: 'CZK', rate: 0.0739, name: 'Czech Koruna' },
      { currency: 'HUF', rate: 1.18, name: 'Hungarian Forint' },
      { currency: 'RUB', rate: 0.287, name: 'Russian Ruble' },
      { currency: 'BRL', rate: 0.019, name: 'Brazilian Real' },
      { currency: 'MXN', rate: 0.0651, name: 'Mexican Peso' },
      { currency: 'KRW', rate: 5.05, name: 'South Korean Won' },
      { currency: 'SGD', rate: 0.00458, name: 'Singapore Dollar' },
      { currency: 'HKD', rate: 0.0274, name: 'Hong Kong Dollar' },
      { currency: 'NZD', rate: 0.00615, name: 'New Zealand Dollar' },
      { currency: 'ZAR', rate: 0.0613, name: 'South African Rand' },
      { currency: 'TRY', rate: 0.148, name: 'Turkish Lira' },
      { currency: 'THB', rate: 0.116, name: 'Thai Baht' },
      { currency: 'MYR', rate: 0.0149, name: 'Malaysian Ringgit' },
      { currency: 'IDR', rate: 58.71, name: 'Indonesian Rupiah' },
      { currency: 'PHP', rate: 0.206, name: 'Philippine Peso' },
      { currency: 'VND', rate: 92.66, name: 'Vietnamese Dong' }
    ];
    
    this.currencyRatesSubject.next(fallbackRates);
    return new Observable(observer => {
      observer.next(fallbackRates);
      observer.complete();
    });
  }

  // Convert currency name to full name
  private getCurrencyName(currencyCode: string): string {
    const currencyNames: { [key: string]: string } = {
      'USD': 'United States Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'AED': 'UAE Dirham',
      'SAR': 'Saudi Riyal',
      'BDT': 'Bangladeshi Taka',
      'INR': 'Indian Rupee',
      'CNY': 'Chinese Yuan',
      'JPY': 'Japanese Yen',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'CHF': 'Swiss Franc',
      'SEK': 'Swedish Krona',
      'NOK': 'Norwegian Krone',
      'DKK': 'Danish Krone',
      'PLN': 'Polish Zloty',
      'CZK': 'Czech Koruna',
      'HUF': 'Hungarian Forint',
      'RUB': 'Russian Ruble',
      'BRL': 'Brazilian Real',
      'MXN': 'Mexican Peso',
      'KRW': 'South Korean Won',
      'SGD': 'Singapore Dollar',
      'HKD': 'Hong Kong Dollar',
      'NZD': 'New Zealand Dollar',
      'ZAR': 'South African Rand',
      'TRY': 'Turkish Lira',
      'THB': 'Thai Baht',
      'MYR': 'Malaysian Ringgit',
      'IDR': 'Indonesian Rupiah',
      'PHP': 'Philippine Peso',
      'VND': 'Vietnamese Dong'
    };

    return currencyNames[currencyCode] || currencyCode;
  }

  // Convert amount from foreign currency to PKR
  convertToPKR(amount: number, fromCurrency: string): number {
    const rates = this.currencyRatesSubject.value;
    const currencyRate = rates.find(rate => rate.currency === fromCurrency);
    
    if (currencyRate) {
      return amount * currencyRate.rate;
    }
    
    return amount; // Return original amount if currency not found
  }

  // Get current rates (synchronous)
  getCurrentRates(): CurrencyRate[] {
    return this.currencyRatesSubject.value;
  }
}
