import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home.service';

import { airports } from '../../../assets/constants/flight-airports';
import { stations } from '../../../assets/constants/train-stations';
import { cities } from '../../../assets/constants/cities';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import * as moment from 'moment';

let states: any = [];

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent implements OnInit {
  tab: Number = 1;

  currentDate = moment(new Date()).format('YYYY-MM-DD');

  minDateForCheckIn: any;
  minDateForCheckOut: any;

  public model: any;
  public flightFrom: any;
  public flightTo: any;
  public trainFrom: any;
  public trainTo: any;
  public busFrom: any;
  public busTo: any;

  allAirportsData: any = [];
  allCitiesData: any = [];
  AllStationData: any = [];

  bookingForm!: FormGroup;
  flightBookingForm!: FormGroup;
  busBookingForm!: FormGroup;
  trainBookingForm!: FormGroup;
  locData: any = [];
  selectedLoc: any;
  date: any;
  returnDate: any;
  ff: any;
  ft: any;
  flightAdult: any = 1;
  flightChild: any = 0;
  flightInfants: any = 0;
  flightTrip: any = 'Single';

  tf: any;
  tt: any;
  bf: any;
  bt: any;
  trainTrip: any = 'Single';

  airportsArray: any = [];
  airportsTo: any = [];

  stationsArray: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private homeService: HomeService
  ) {
    airports.forEach((i: any) => {
      this.allAirportsData.push(i.location);
    });
    stations.forEach((i: any) => {
      this.AllStationData.push(i.name);
    });

    cities.forEach((i: any) => {
      this.allCitiesData.push(i.location);
    });

    this.minDateForCheckIn = moment(new Date()).format('YYYY-MM-DD');
    this.minDateForCheckOut = moment(new Date()).format('YYYY-MM-DD');
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.allCitiesData
              .filter(
                (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  searchStations = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.AllStationData.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 10)
      )
    );

  searchAirports = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.allAirportsData
              .filter(
                (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  allAirports = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.allAirportsData
              .filter(
                (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  allStations = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.AllStationData.filter(
              (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 10)
      )
    );

  formatter = (x: { site: string }) => x.site;

  ngOnInit(): void {
    this.airportsArray = airports;
    this.stationsArray = stations;
    this.createForm();
    this.flightForm();
    this.createTrainForm();
    this.getCities();
    this.splitAirports();

    this.bookingForm.valueChanges.subscribe((value: any) => {
      this.minDateForCheckOut = moment(value.checkIn).format('YYYY-MM-DD');
    });
  }

  splitAirports() {
    this.airportsTo = this.airportsArray.filter((i: any) => {
      return i.country === 'Pakistan';
    });
    //  console.log(this.airportsTo);
    //  debugger;
  }

  private createForm() {
    this.bookingForm = this.formBuilder.group({
      checkIn: [new Date(), Validators.required],
      location: [new Date(), Validators.required],
      checkOut: ['', Validators.required],
      room: [1],
      adults: [1],
      children: [0],
    });
    this.busBookingForm = this.formBuilder.group({
      busFrom: ['', Validators.required],
      busTo: ['', Validators.required],
      checkOut: ['', Validators.required],
    });
  }

  private createTrainForm() {
    this.trainBookingForm = this.formBuilder.group({
      trainFrom: ['', Validators.required],
      trainTrip: [''],
      trainTo: ['', Validators.required],
    });
  }

  private flightForm() {
    this.flightBookingForm = this.formBuilder.group({
      to: ['', Validators.required],
      cabin: '',
      arrival: ['', Validators.required],
      returnDate: [''],
      from: ['', Validators.required],
      flightTrip: [''],
      flightAdult: [1],
      flightChild: [0],
      flightInfants: [0],
    });
  }

  getCities() {
    states = [];
    this.homeService.getCities().then((data: any) => {
      // console.log('Cities: ', data);
      this.locData = data;
      if (data) {
        data.forEach((i: any) => {
          states.push(i.name);
        });
        // console.log(states);
        // debugger;
      }
    });
  }

  itemSelected(event: any) {
    this.selectedLoc = event.target.value;
    this.selectedLoc = cities.filter((i: any) => {
      return (
        i.location == event.target.value ||
        i.locationSmall == event.target.value
      );
    });
  }

  getTrainFrom(event: any) {
    this.trainFrom = event.target.value;
    this.tf = stations.filter((i: any) => {
      return i.name == this.trainFrom;
    });
  }

  getTrainTo(event: any) {
    this.trainTo = event.target.value;
    this.tt = stations.filter((i: any) => {
      return i.name == this.trainTo;
    });
  }

  getBusFrom(event: any) {
    this.busFrom = event.target.value;
    this.bf = cities.filter((i: any) => {
      return i.location == this.busFrom || i.locationSmall == this.busFrom;
    });
  }

  getBusTo(event: any) {
    this.busTo = event.target.value;
    this.bt = cities.filter((i: any) => {
      return i.location == this.busTo || i.locationSmall == this.busTo;
    });
  }

  getTrainTrip(event: any) {
    this.trainTrip = event.target.value;
  }

  getFlightTo(event: any) {
    this.flightTo = event.target.value;
    this.ft = airports.filter((i: any) => {
      return i.location == this.flightTo;
    });
  }

  getFlightFrom(event: any) {
    this.flightFrom = event.target.value;
    this.ff = airports.filter((i: any) => {
      return i.location == this.flightFrom;
    });
  }

  getFlightAdult(event: any) {
    this.flightAdult = event.target.value;
  }

  getFlightChild(event: any) {
    this.flightChild = event.target.value;
  }

  getFlightInfants(event: any) {
    // console.log(event.target.value);
    this.flightInfants = event.target.value;
  }

  getFlightTrip(event: any) {
    this.flightTrip = event.target.value;
  }

  navigateHotel() {
    this.router.navigate([`/booking/hotel`], {
      queryParams: this.bookingForm.value,
    });
  }
  navigateflight() {
    this.router.navigate([`/booking/flight`], {
      queryParams: this.flightBookingForm.value,
    });
  }
  navigatebus() {
    this.router.navigate([`/booking/bus`], {
      queryParams: this.busBookingForm.value,
    });
  }

  navigateToTrainBooking() {
    window.open(
      `https://pakrail.gov.pk/PlanJourney.aspx?planFromStation=${this.tf[0].value}&planToStation=${this.tt[0].value}&planTripType=${this.trainTrip}`,
      '_blank'
    );
  }

  // setMinDate(){
  //   this.minDate = moment();
  //   debugger;
  // }

  navigateToFlightBooking() {
    // console.log('readed');
    this.navigateflight();
    // console.log(this.ff[0].iataCode)
    // console.log(this.ft[0].iataCode)
    // var loc = `https://www.sastaticket.pk/air/search?cabinClass[code]=Y&cabinClass[label]=Economy&flexibility=&legs[0][origin]=${this.ff[0].iataCode}&legs[0][destination]=${this.ft[0].iataCode}&legs[0][departureDate]=${this.date}&nonStopFlight=false&travelerCount[numAdult]=1&travelerCount[numChild]=0&travelerCount[numInfant]=0&routeType=ONEWAY`;

    // if (this.flightTrip == 'Single') {
    //   window.open(
    //     `https://www.sastaticket.pk/air/search?cabinClass[code]=Y&cabinClass[label]=Economy&flexibility=&legs[0][origin]=${this.ff[0].iataCode}&legs[0][destination]=${this.ft[0].iataCode}&legs[0][departureDate]=${this.date}&nonStopFlight=false&travelerCount[numAdult]=${this.flightAdult}&travelerCount[numChild]=${this.flightChild}&travelerCount[numInfant]=${this.flightInfants}&routeType=ONEWAY`,
    //     '_blank'
    //   );
    // } else {
    //   window.open(
    //     `https://www.sastaticket.pk/air/search?cabinClass[code]=Y&cabinClass[label]=Economy&flexibility=&legs[0][origin]=${this.ff[0].iataCode}&legs[0][destination]=${this.ft[0].iataCode}&legs[0][departureDate]=${this.date}&legs[1][origin]=${this.ft[0].iataCode}&legs[1][destination]=${this.ff[0].iataCode} &legs[1][departureDate]=${this.returnDate}&nonStopFlight=false&travelerCount[numAdult]=${this.flightAdult}&travelerCount[numChild]=${this.flightChild}&travelerCount[numInfant]=${this.flightInfants}&routeType=RETURN`,
    //     '_blank'
    //   );
  }

  // window.open(loc, '_blank');
  // debugger;
  // console.log(loc);
}
