import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  AfterContentChecked,
  AfterContentInit,
  HostListener,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Shell } from '../shell.service';

import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';

import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { CommonService } from '../../common/common.service';
import { Subject } from 'rxjs';
import { AuthModalComponent } from '@app/common/auth-modal/auth-modal.component';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const log = new Logger('Login');
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy, AfterContentChecked {
  blogUrl: string | null = environment.blogUrl;
  menuHidden = true;
  version: string | null = environment.version;
  error: string | undefined;
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLoading = false;
  isLoginModal = false;
  isSignupModal = false;
  isResetPasswordModal = false;
  isLoggedIn: boolean;
  userName: string;
  isEnglish = true;
  isUrdu = false;
  isGerman = false;
  provinces: any = [];

  show: boolean = false;
  showDropdowns: any = {
    whereToGo: false,
    explorePakistan: false,
    bookings: false,
    evisa: false
  };

  socialUser: SocialUser;
  addClassFixedNav: boolean = false;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    public ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private readonly httpClient: HttpClient,
    private readonly httpClientModule: HttpClientModule,
    private readonly shellService: Shell,
    private authService: SocialAuthService,
    private commonService: CommonService,
    private viewPortScroller: ViewportScroller
  ) {
    localStorage.setItem('redirectUrl', this.router.url);
    this.initializeLogin();
    this.initializeSignup();
    translate.addLangs(['en', 'ur', 'de']);
    translate.setDefaultLang('en');
  }

  destroy = new Subject();

  destroy$ = this.destroy.asObservable();

  @HostListener('window:scroll', []) onWindowScroll() {
    if (window.scrollY > 80) {
      this.addClassFixedNav = true;
    } else if (window.scrollY < 80) {
      this.addClassFixedNav = false;
    }

    this.commonService.scrollY.next(window.scrollY);
  }

  ngAfterViewInit(): void {
    this.ngxSmartModalService
      .getModal('myModal')
      .onClose.subscribe((modal: NgxSmartModalComponent) => {
        this.isResetPasswordModal = false;
        this.isSignupModal = false;
      });
    this.ngxSmartModalService
      .getModal('myModal')
      .onDismiss.subscribe((modal: NgxSmartModalComponent) => {
        this.isResetPasswordModal = false;
        this.isSignupModal = false;
      });
    this.ngxSmartModalService
      .getModal('myModal')
      .onOpen.subscribe((modal: NgxSmartModalComponent) => {});
  }
  ngAfterContentChecked(): void {
    this.isLoggedIn = this.credentialsService.isAuthenticated();
    this.userName = localStorage.getItem('fName') || '';
  }
  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      // console.log('social user', user);
      this.socialUser = user;
      this.socialLogin(user);
    });
    this.getProvinces();
    this.initializeSignup();
    this.initializeLogin();
    this.loadMainScript();
    // debugger;
  }

  public loadMainScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = '../../assets/js/main.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  getProvinces() {
    // this.shellService.getProvinces().then((data: any) => {
    //   console.log('header component', data);
    //   this.provinces = data;
    //   this.isLoading = false;
    //   console.log(this.provinces);
    //   // debugger;
    //   this.provinces.filter((province: any, index: number) => {
    //     //   if (!category.thumbnail) {
    //     // category.thumbnail = this.images[index];
    //     //   }
    //   });
    // });
    this.shellService.getProvinces().then((data: any) => {
      console.log('header component', data);
    
      // Sort alphabetically by name (case-insensitive)
      this.provinces = data.sort((a: any, b: any) => {
        return a.name.localeCompare(b.name);
      });
    
      this.isLoading = false;
      console.log(this.provinces);
    });

    // .subscribe((data: any) => {
    //   //  console.log(data);
    //   this.provinces = data.data;
    //   // console.log('Provincessssssssssssss', this.provinces);
    //   // debugger
    // });
  }

  switchLanguage(language: string): void {
    this.translate.use(language);
    this.isEnglish = language === 'en' ? true : false;
    this.isUrdu = language === 'ur' ? true : false;
    this.isGerman = language === 'de' ? true : false;
  }
  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  logout() {
    this.authenticationService
      .logout()
      .subscribe(() => this.router.navigate(['/'], { replaceUrl: true }));
    localStorage.clear();
    this.signOut();
  }

  get email(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }
  setSession(res: any) {
    return {
      userId: res.id,
      email: res.email,
      fName: res.profile.firstName,
      token: res.token,
      userType: res.type,
      userGender: res.profile.gender,
      userData: JSON.stringify(res),
    };
  }
  socialLogin(soicalUser: any) {
    this.authenticationService.login(soicalUser).subscribe(
      (res) => {
        if (res) {
          const user = this.setSession(res.data);
          this.credentialsService.setCredentials(user, true);
          this.ngxSmartModalService.getModal('myModal').close();
          this.toastr.success(
            'Success',
            `Welcome ${localStorage.getItem('fName')}!`
          );
        }
      },
      (err) => {
        // console.log('login error', err.error);
        this.toastr.error('Invalid E-mail or Password', 'Error');
      }
    );
    // console.log('login');
  }
  login() {
    this.authenticationService.login(this.loginForm.value).subscribe(
      (res) => {
        if (res) {
          const user = this.setSession(res.data);
          this.credentialsService.setCredentials(user, true);
          this.ngxSmartModalService.getModal('myModal').close();
          this.toastr.success(
            'Success',
            `Welcome ${localStorage.getItem('fName')}!`
          );
          this.credentialsService.changeStatus('loggedIn');
        }
      },
      (err) => {
        // console.log('login error', err.error);
        this.toastr.error('Invalid E-mail or Password', 'Error');
      }
    );
    // console.log('login');
  }
  signUp() {
    this.authenticationService.signUp(this.signupForm.value).subscribe(
      (res) => {
        const user = this.setSession(res);
        this.credentialsService.setCredentials(user, true);
        this.ngxSmartModalService.getModal('myModal').close();
        this.toastr.success(
          'Logged In',
          `Welcome, ${localStorage.getItem('fName')}!`
        );
      },
      (err) => {
        this.toastr.error(
          'Couldn`t create user',
          err.error.error.message || 'Error'
        );
        // console.log('signup error', err);
      }
    );
  }
  openModal(modal: string): void {
    if (modal === 'signIn') {
      this.isLoginModal = true;
      this.isSignupModal = false;
      this.isResetPasswordModal = false;
    } else if (modal === 'signUp') {
      this.isLoginModal = false;
      this.isSignupModal = true;
      this.isResetPasswordModal = false;
    } else {
      this.isLoginModal = false;
      this.isSignupModal = false;
      this.isResetPasswordModal = true;
    }
  }

  ngOnDestroy() {}
  private initializeLogin() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(emailRegex)],
      ],
      password: ['', Validators.required],
      rememeber: true,
    });
  }
  private initializeSignup() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      gender: ['male'],
      dob: ['', Validators.required],
      type: ['customer'],
      // terms: ['', Validators.required],
    });
  }

  navigate = (args1: any, args2: any) => {
    this.router.navigate([args1, args2]);
  };

  changeMessage = () => {
    const currentState = this.commonService.messageSource.value;
    const newState = currentState === 'active' ? 'inActive' : 'active';
    this.commonService.changeMessage(newState);
  };

  toggleSidebar = () => {
    this.show = !this.show;
    // Prevent body scroll when menu is open
    if (this.show) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      // Close all dropdowns when menu closes
      Object.keys(this.showDropdowns).forEach(key => {
        this.showDropdowns[key] = false;
      });
    }
  };

  toggleDropdown = (key: string) => {
    this.showDropdowns[key] = !this.showDropdowns[key];
  };

  openAuthModal() {
    const modal = this.ngxSmartModalService.create(
      'authModal',
      AuthModalComponent,
      { customClass: 'authModalClass' }
    );
    modal.open();
  }

  scrollToBookings() {
    this.router.navigate(['/']);
    setTimeout(() => {
      this.viewPortScroller.scrollToAnchor('bookingSectionTab');
    }, 400);
  }

  scrollToVisa() {
    this.router.navigate(['/']);
    setTimeout(() => {
      this.viewPortScroller.scrollToAnchor('visa');
    }, 400);
  }
}
