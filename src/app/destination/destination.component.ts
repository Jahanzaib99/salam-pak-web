import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  DebugElement,
  OnInit,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Route } from '@angular/router';
import defaultImage from '../../assets/images/home/cities.png';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { HomeService } from '../services/home.service';
import { Shell } from '../shell/shell.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { AuthModalComponent } from '../common/auth-modal/auth-modal.component';
import { CreatePlanComponent } from '../planning-popups/create-plan/create-plan.component';
import { PlanListingComponent } from '../planning-popups/plan-listing/plan-listing.component';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const responsiveSettings = [
  {
    breakpoint: 1920,
    settings: {
      slidesToShow: 4,
      infinite: true,
    },
  },
  {
    breakpoint: 1200,
    settings: {
      slidesToShow: 3.0,
      infinite: true,
    },
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 2.0,
      infinite: true,
    },
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 1.5,
      infinite: true,
    },
  },
];

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss'],
})
export class DestinationComponent implements OnInit, AfterViewInit {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;

  // feedBackForm!: FormGroup;

  loginForm!: FormGroup;

  surroundings: any = [];
  show: boolean;
  surroundingMakers: any = [];
  selectedSur: any;
  userId: any;
  location: any;
  eventId: any;
  userData: any;
  rating: any;
  isLoggedIn: any;
  center: google.maps.LatLngLiteral;
  // data: any;
  locations: any = [];
  userPlans: any = [];
  categories: any = [];
  activities: any = [];
  slideConfig = {
    slidesToShow: 4.0,
    slidesToScroll: 4,
    arrows: true,
    responsive: responsiveSettings,
  };

  wishlistLocs: any = [];

  isAddtoPlanClicked: boolean = false;

  imageSliderConfig = {
    slidesToShow: 1.0,
    slidesToScroll: 1,
    arrows: true,
    // responsive: responsiveSettings,
  };

  // for testing purpose...

  userHasPlans: boolean = true;

  ratingValue: any = 0;
  title: any;
  isSubmitted: boolean;
  weatherData: any;
  weatherApi: any = `https://forecast7.com/en/33d7373d09/islamabad/`;
  weatherLabel: any = 'ISLAMABAD';
  phoneMask = [
    /[0-9]/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  loc: any;
  redirectUrl: string;
  localImageArray: any = [];
  showImgs: any;

  infoWondowData = {
    photo: '',
    alias: '',
    province: '',
    redirectLink: '',
  };

  planBtnText = 'Add to plan';
  tab: Number = 1;
  constructor(
    private readonly eventService: EventService,
    private readonly route: ActivatedRoute,
    private shellService: Shell,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    public ngxSmartModalService: NgxSmartModalService,
    public homeService: HomeService,
    public routeLocation: Location,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {

    
    // this.isLoggedIn = this.credentialsService.isAuthenticated();

    // this.loc = this.routeLocation.path();

    // this.redirectUrl = this.generateSocialMediaUrls();
    this.route.params.subscribe((res: any) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.isLoggedIn = this.credentialsService.isAuthenticated();

      this.loc = this.routeLocation.path();

      this.redirectUrl = this.generateSocialMediaUrls();

      // console.log(res);
      this.location = this.route.snapshot.data.location;
      this.surroundings = this.location.surroundings;

      this.center = {
        lat: this.location?.location.coordinates[1],
        lng: this.location?.location.coordinates[0],
      };

      this.infoWondowData.photo = this.location?.thumbnails[0];
      this.infoWondowData.alias = this.location?.alias;

      if (this.location.weatherId) {
        this.weatherApi = `https://forecast7.com/en/${this.location.weatherId}/`;
        this.weatherLabel = this.location.name.toUpperCase().toString();
        this.loadWeather('script', 'weatherwidget-io-js');
      } else {
        this.loadWeather('script', 'weatherwidget-io-js');
      }
      // debugger;
    });
    this.eventId = this.route.snapshot.data.location._id;
    this.userId = localStorage.getItem('userId');
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.getLocations();
    // this.createForm();
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  loadWeather(s: any, id: any) {
    var js,
      fjs = document.getElementsByTagName(s)[0];
    js = document.createElement(s);
    js.id = id;
    js.src = 'https://weatherwidget.io/js/widget.min.js';
    fjs.parentNode.insertBefore(js, fjs);
  }

  // userFeedback = {
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   rating: '',
  //   description: '',
  //   locationId: '',
  //   title: '',
  //   phone: '',
  // };

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    this.credentialsService.currentStatus.subscribe((res: any) => {
      // debugger;
      if (this.isAddtoPlanClicked && res === 'loggedIn') {
        // debugger;
        this.addToPlan();
      }
    });
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth',
    // });
    // if (this.isLoggedIn) {
    //   this.getWishlist();
    //   this.getUserPlan();
    //   // this.createFeedbackForm();
    // }
    // console.log(localStorage.getItem('userId'))
    this.isLoggedIn = localStorage.getItem('userId');
    this.credentialsService.currentStatus.subscribe((status: any) => {
      if (status == 'loggedIn') {
        this.isLoggedIn = true;
        this.userId = localStorage.getItem('userId');
        this.getWishlist();
        this.getUserPlan();
        //  debugger;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  public loadScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../assets/js/where-to-go.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  getWishlist() {
    // console.log(localStorage.getItem('userId'));
    this.eventService.getUserWishList(this.userId).subscribe((data: any) => {
      if (data.data.locations.length > 0) {
        data.data.locations?.forEach((item: any) => {
          this.wishlistLocs.push(item._id);
        });
        this.isInWishlist();
      } else {
        this.wishlistLocs = [];
      }
    });
  }

  getUserPlan() {
    this.eventService.getUserPlan(this.userId).subscribe((data: any) => {
      // debugger;
      if (data?.locations?.length) {
        data.locations?.forEach((item: any) => {
          this.userPlans.push(item._id);
        });
        this.isInPlan();
      } else {
        this.userPlans = [];
      }
    });
  }

  removeFromWishlist() {
    this.eventService
      .removeFromWishlist(this.eventId)
      .subscribe((data: any) => {
        this.wishlistLocs.splice(this.wishlistLocs.indexOf(this.eventId), 1);
      });
  }

  removeFromPlan() {
    this.eventService.removeFromPlan(this.eventId).subscribe((data: any) => {
      this.userPlans.splice(this.userPlans.indexOf(this.eventId), 1);
    });
  }

  addToWishlist() {
    if (this.userId) {
      this.eventService.addToWishlist(this.eventId).subscribe((data: any) => {
        this.getWishlist();
      });
    } else {
      const modal = this.ngxSmartModalService.create(
        'authModal',
        AuthModalComponent,
        {
          customClass: 'authModalClass',
        }
      );
      modal.open();
    }
  }

  addToPlan() {
    this.isAddtoPlanClicked = true;
    this.userId = localStorage.getItem('userId');
    // console.log(this.ngxSmartModalService.getModalStack());
    // this.ngxSmartModalService.get('createPlanModal').close();
    // this.ngxSmartModalService.removeModal('createPlanModal');
    if (!this.userId) {
      this.ngxSmartModalService.closeAll;
      const modal = this.ngxSmartModalService.create(
        'authModal',
        AuthModalComponent,
        {
          customClass: 'authModalClass',
        }
      );
      modal.open();
    } else {
      // debugger;
      this.fetchUserPlans();
    }
  }

  isInWishlist() {
    return this.wishlistLocs.includes(this.eventId);
  }

  isInPlan() {
    return this.userPlans.includes(this.eventId);
  }
  getLocations() {
    // debugger;
    this.eventService
      .getLocations([
        this.location?.location.coordinates[1],
        this.location?.location.coordinates[0],
      ])
      .then((locations) => {
        this.locations = locations;
        this.locations.filter((location: any) => {
          if (!location.thumbnail) {
            location.thumbnail = defaultImage;
          }
        });
      });
  }

  updateValue(val: any) {
    this.ratingValue = val;
  }

  showCarousel = (index: any) => {
    this.showImgs = true;

    this.localImageArray = this.location.photos.map((val: any) => {
      return val;
    });
    const tempFirstImg = this.localImageArray[0];
    this.localImageArray[0] = this.localImageArray[index];
    this.localImageArray[index] = tempFirstImg;

    this.ngxSmartModalService.getModal('carouselModal').open();
  };

  next() {
    this.slickModal.slickNext();
  }

  prev() {
    this.slickModal.slickPrev();
  }

  ngAfterViewInit(): void {
    $('#stars li')
      .on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        $(this)
          .parent()
          .children('li.star')
          .each(function (e) {
            if (e < onStar) {
              $(this).addClass('hover');
            } else {
              $(this).removeClass('hover');
            }
          });
      })
      .on('mouseout', function () {
        $(this)
          .parent()
          .children('li.star')
          .each(function (e) {
            $(this).removeClass('hover');
          });
      });

    /* 2. Action to perform on click */
    $('#stars li').on('click', function () {
      var onStar = parseInt($(this).data('value'), 10); // The star currently selected
      var stars = $(this).parent().children('li.star');

      for (var i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }

      for (var i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }

      // JUST RESPONSE (Not needed)
      var ratingValue = parseInt(
        $('#stars li.selected').last().data('value'),
        10
      );
      var msg = '';
      if (ratingValue > 1) {
        msg = 'Thanks! You rated this ' + ratingValue + ' stars.';
      } else {
        msg =
          'We will improve ourselves. You rated this ' +
          ratingValue +
          ' stars.';
      }
      // responseMessage(msg);
    });

    $('.nsm-overlay-open').on('click', function () {
      alert('Clicked!');
    });
  }

  private generateSocialMediaUrls(): string {
    return `${environment.portalUrl}/${this.routeLocation.path()}`;
  }

  getRatingStars(rating?: any): string {
    // Get the value
    const val = parseFloat(rating);
    // Turn value into number/100
    const size = (val / 5) * 100;

    return size + '%';
  }
  navigateOnClick(surrounding: any) {
    // debugger
    this.selectedSur = surrounding.name;
    // this.center = {
    //   lat: this.location?.location.coordinates[0],
    //   lng: this.location?.location.coordinates[1],
    // };
    this.eventService
      .getSurroundings(this.location?.location.coordinates, surrounding.typeKey)
      .then((data: any) => {
        this.surroundingMakers = data.data;
        this.show = true;
        // console.log(this.surroundingMakers);
        // debugger;
      });

    // let url = `/map/cities/${surrounding.name}`;

    // this.location.go(url);
  }

  hideCarousel() {
    this.showImgs = false;
  }

  // private createForm() {
  //   this.loginForm = this.formBuilder.group({
  //     email: ['', Validators.required],
  //     password: ['', Validators.required],
  //     remember: true,
  //   });
  // }

  // setSession(res: any) {
  //   return {
  //     userId: res.id,
  //     email: res.email,
  //     fName: res.profile.firstName,
  //     token: res.token,
  //     userType: res.type,
  //     userGender: res.profile.gender,
  //     userData: JSON.stringify(res),
  //   };
  // }

  // login() {
  //   this.authenticationService.login(this.loginForm.value).subscribe(
  //     (res) => {
  //       if (res) {
  //         const user = this.setSession(res.data);
  //         this.credentialsService.setCredentials(user, true);
  //         this.ngxSmartModalService.getModal('loginModal').close();
  //         this.toastr.success('Success', `Welcome ${localStorage.getItem('fName')}!`);
  //       }
  //     },
  //     (err) => {
  //       console.log('login error', err.error);
  //       this.ngxSmartModalService.getModal('loginModal').close();
  //       this.toastr.error('Invalid E-mail or Password', 'Error');
  //     }
  //   );
  //   // console.log('login');
  // }

  fetchUserPlans() {
    this.eventService.getUserPlan(this.userId).subscribe((res: any) => {
      this.ngxSmartModalService.removeModal('planListingModal');
      if (res.length > 0) {
        this.ngxSmartModalService.closeAll;
        this.userPlans = res;
        this.userPlans['locations'] = [this.location._id];
        const modal = this.ngxSmartModalService
          .create('planListingModal', PlanListingComponent)
          .setData(this.userPlans);
        modal.open();
      } else {
        var data = { locations: [this.location._id] };
        const modal = this.ngxSmartModalService
          .create('createPlanModal', CreatePlanComponent)
          .setData(data);
        modal.open();
      }
    });
  }

  getHref = (item: any) => {
    return `https://www.google.com/maps/place/?q=place_id:${item.place_id}`;
  };
}
