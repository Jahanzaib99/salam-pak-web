import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Location, ViewportScroller } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { Shell } from '../shell.service';
import { EventService } from '../../services/event.service';
import { CommonService } from '../../common/common.service';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { environment } from '@env/environment';
// import * as $ from 'jquery';

let states: any = [];

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  cmsUrl: string | null = environment.cmsUrl;
  public model: any;
  isLoading = false;
  data: any;
  hide = false;

  show: boolean = false;
  showUpArrow: boolean = false;
  allNews: any;

  constructor(
    private shellService: Shell,
    private eventService: EventService,
    private readonly router: Router,
    private viewPortScroller: ViewportScroller,
    public commonService: CommonService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : states
              .filter(
                (v: any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  formatter = (x: { site: string }) => x.site;

  ngOnInit() {
    this.getFilters();
    this.getAllNews();
    this.commonService.currentMessage.subscribe((message: any) => {
      // console.log('Message from CommonService: ', message);
      this.show = message == 'inActive' ? false : true;
    });

    this.commonService.scrollY$.subscribe((val: any) => {
      if (val > 700) {
        this.showUpArrow = true;
      } else if (val < 700) {
        this.showUpArrow = false;
      }
    });
  }

  closeSearch() {
    this.show = false;
    this.commonService.changeMessage('inActive');
  }

  getFilters() {
    states = [];
    this.eventService.getAllCities().then((data: any) => {
      data.forEach((item: any) => {
        if (item.locationType === 'city') {
          states.push(item.name);
        }
      });
    });
  }

  getAllNews() {
    this.eventService.getNews().then((res: any) => {
      this.allNews = res.filter((item: any) => {
        return item.isFeatured == true;
      });
    });
  }

  openComplaint() {
    this.ngxSmartModalService.getModal('complaintModalPopup').open();
  }

  itemSelected(event: any) {
    const toKebabCase = (str: string) =>
      str &&
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map((x) => x.toLowerCase())
        .join('-');
    $('.close-search').trigger('click');
    var key = toKebabCase(event.target.value.toString());
    // window.location.href = `/map/cities/${key}`;
    this.router.navigate(['/map/cities', key]);
  }

  ngOnDestroy() {}

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  getBannerNews() {
    this.eventService.getNews().then((news: any) => {
      // console.log(news);
    });
  }
}
