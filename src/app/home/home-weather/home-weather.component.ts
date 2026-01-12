import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home-weather',
  templateUrl: './home-weather.component.html',
  styleUrls: ['./home-weather.component.scss'],
})
export class HomeWeatherComponent implements OnInit {
  @Input() weatherFlag: boolean = false;

  constructor() {}
  cities: any = [
    {
      name: 'islamabad',
      alias: 'Islamabad',
      city_code: '33d7373d09',
    },
    {
      name: 'bahawalpur',
      alias: 'Bahawalpur',
      city_code: '29d3571d69',
    },
    {
      name: 'chitral',
      alias: 'Chitral',
      city_code: '35d7771d77',
    },
    {
      name: 'gilgit',
      alias: 'Gilgit',
      city_code: '35d9174d37',
    },
    {
      name: 'hyderabad',
      alias: 'Hyderabad',
      city_code: '25d4068d36',
    },
    {
      name: 'Hunza',
      alias: 'Hunza',
      city_code: '36d3974d69',
    },
    {
      name: 'karachi',
      alias: 'Karachi',
      city_code: '24d8667d01',
    },
    {
      name: 'lahore',
      alias: 'Lahore',
      city_code: '31d5574d36',
    },
    {
      name: 'malakand',
      alias: 'Malakand',
      city_code: '34d5071d90',
    },
    {
      name: 'mirpur-azad-kashmir',
      alias: 'Mirpur',
      city_code: '33d1073d77',
    },
    {
      name: 'multan',
      alias: 'Multan',
      city_code: '30d1671d52',
    },
    {
      name: 'murree',
      alias: 'Murree',
      city_code: '33d9073d39',
    },
    {
      name: 'muzaffarabad',
      alias: 'Muzaffarabad',
      city_code: '34d3673d48',
    },
    {
      name: 'naran',
      alias: 'Naran',
      city_code: '34d9173d65',
    },
    {
      name: 'nathia-gali',
      alias: 'Nathia Gali',
      city_code: '34d0773d38',
    },
    {
      name: 'peshawar',
      alias: 'Peshawar',
      city_code: '34d0271d52',
    },
    {
      name: 'quetta',
      alias: 'Quetta',
      city_code: '30d1866d97',
    },
    {
      name: 'rawalpindi',
      alias: 'Rawalpindi',
      city_code: '33d5773d02',
    },
    {
      name: 'Skardu',
      alias: 'Skardu',
      city_code: '35d3275d55',
    },
    {
      name: 'sukkur',
      alias: 'Sukkur',
      city_code: '27d7268d82',
    },
    {
      name: 'swat',
      alias: 'Swat',
      city_code: '34d8172d35',
    },
    {
      name: 'turbat',
      alias: 'Makran',
      city_code: '26d0163d04',
    },
    {
      name: 'kumrat-valley',
      alias: 'Kumrat Valley',
      city_code: '35d5672d20',
    },
  ];
  // cities: any = [
  //   {
  //     name: 'islamabad',
  //     alias: 'Islamabad',
  //     city_code: '33d7373d09',
  //   },
  //   {
  //     name: 'bahawalpur',
  //     alias: 'Bahawalpur',
  //     city_code: '29d3571d69',
  //   },
  //   {
  //     name: 'd-g-khan',
  //     alias: 'Dera Ghazi Khan',
  //     city_code: '30d0570d65',
  //   },
  //   {
  //     name: 'faisalabad',
  //     alias: 'Faisalabad',
  //     city_code: '31d4273d09',
  //   },
  //   {
  //     name: 'gujranwala',
  //     alias: 'Gujranwala',
  //     city_code: '32d1974d19',
  //   },
  //   {
  //     name: 'lahore',
  //     alias: 'Lahore',
  //     city_code: '31d5574d36',
  //   },
  //   {
  //     name: 'multan',
  //     alias: 'Multan',
  //     city_code: '30d1671d52',
  //   },
  //   {
  //     name: 'rawalpindi',
  //     alias: 'Rawalpindi',
  //     city_code: '33d5773d02',
  //   },
  //   {
  //     name: 'sahiwal',
  //     alias: 'Sahiwal',
  //     city_code: '30d6773d11',
  //   },
  //   {
  //     name: 'sargodha',
  //     alias: 'Sargodha',
  //     city_code: '32d0772d69',
  //   },
  //   {
  //     name: 'kalat',
  //     alias: 'Kalat',
  //     city_code: '29d0566d59',
  //   },
  //   {
  //     name: 'turbat',
  //     alias: 'Makran',
  //     city_code: '26d0163d04',
  //   },
  //   {
  //     name: 'nasirabad',
  //     alias: 'Naseerabad',
  //     city_code: '27d3867d92',
  //   },
  //   {
  //     name: 'quetta',
  //     alias: 'Quetta',
  //     city_code: '30d1866d97',
  //   },
  //   //---
  //   {
  //     name: 'dhadar',
  //     alias: 'Sibi',
  //     city_code: '29d4867d64',
  //   },
  //   {
  //     name: 'zhob',
  //     alias: 'Zhob',
  //     city_code: '31d3569d47',
  //   },
  //   {
  //     name: 'quetta',
  //     alias: 'Rakhshan',
  //     city_code: '30d1866d97',
  //   },
  //   {
  //     name: 'bannu',
  //     alias: 'Bannu',
  //     city_code: '32d9970d65',
  //   },
  //   {
  //     name: 'dera-ismail-khan',
  //     alias: 'Dera Ismail Khan',
  //     city_code: '31d8670d90',
  //   },
  //   {
  //     name: 'hazara',
  //     alias: 'Hazara',
  //     city_code: '32d8074d28',
  //   },
  //   {
  //     name: 'kohat',
  //     alias: 'Kohat',
  //     city_code: '33d5971d44',
  //   },
  //   {
  //     name: 'malakand',
  //     alias: 'Malakand',
  //     city_code: '34d5071d90',
  //   },
  //   //-----

  //   {
  //     name: 'mardan',
  //     alias: 'Mardan',
  //     city_code: '34d2072d02',
  //   },
  //   {
  //     name: 'peshawar',
  //     alias: 'Peshawar',
  //     city_code: '34d0271d52',
  //   },
  //   {
  //     name: 'hyderabad',
  //     alias: 'Hyderabad',
  //     city_code: '25d4068d36',
  //   },
  //   {
  //     name: 'karachi',
  //     alias: 'Karachi',
  //     city_code: '24d8667d01',
  //   },
  //   {
  //     name: 'sukkur',
  //     alias: 'Sukkur',
  //     city_code: '27d7268d82',
  //   },
  //   {
  //     name: 'larkana',
  //     alias: 'Larkana',
  //     city_code: '27d5668d20',
  //   },
  //   {
  //     name: 'mirpur-khas',
  //     alias: 'Mirpur Khas',
  //     city_code: '25d5169d01',
  //   },
  //   {
  //     name: 'gilgit',
  //     alias: 'Gilgit',
  //     city_code: '35d9174d37',
  //   },
  //   {
  //     name: 'mirpur-azad-kashmir',
  //     alias: 'Mirpur',
  //     city_code: '33d1073d77',
  //   },
  //   {
  //     name: 'muzaffarabad',
  //     alias: 'Muzaffarabad',
  //     city_code: '34d3673d48',
  //   },
  //   {
  //     name: 'poonch',
  //     alias: 'Poonch',
  //     city_code: '33d7774d09',
  //   },
  // ];

  ngOnInit(): void {
    this.loadWeather('script', 'weatherwidget-io-js');
  }

  loadWeather(s: any, id: any) {
    var js,
      fjs = document.getElementsByTagName(s)[0];
    js = document.createElement(s);
    js.id = id;
    js.src = 'https://weatherwidget.io/js/widget.min.js';
    fjs.parentNode.insertBefore(js, fjs);
  }

  changeWeather = (event: any) => {
    let widget = document.querySelector('.weatherwidget-io');
    if (!widget) return;
    
    let baseAttr = this.getAttributes(widget);
    let selectedOption = event.target.options[event.target.options.selectedIndex];
    let optionAttr = this.getAttributes(selectedOption);
    let target = widget.querySelector('iFrame');
    
    if (target && target['contentWindow']) {
      target['contentWindow'].postMessage(
        Object.assign({}, baseAttr, optionAttr, { id: target.id }),
        'https://weatherwidget.io'
      );
    }
    
    if (optionAttr['href']) {
      widget['href'] = optionAttr['href'];
    }
  };

  getAttributes(widget: any) {
    return Array.from(widget.attributes).reduce((acc, attr) => {
      acc[attr['name'].replace('data-', '')] = attr['value'];
      return acc;
    }, {});
  }
}
