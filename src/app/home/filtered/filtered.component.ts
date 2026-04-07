import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtered',
  templateUrl: './filtered.component.html',
  styleUrls: ['./filtered.component.scss'],
})
export class FilteredComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() singleFilter: Array<any>;
  @Input() images: Array<any>;
  @Input() isWhereToGo: boolean;
  redirectUrl: string;
  currentIndex: number = 0;
  visibleCards: number = 5;
  cardSpacing: number = 170;
  cardRotation: number = 4;
  cardScaleStep: number = 0.08;
  currentBgImage: string = '';
  private fallbackImage = 'assets/images/home/beaches.webp';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateVisibleCards();
    this.updateBackground();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['singleFilter'] && this.singleFilter?.length) {
      this.updateBackground();
    }
  }

  ngOnDestroy(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateVisibleCards();
  }

  updateVisibleCards(): void {
    const w = window.innerWidth;
    if (w < 576) {
      this.visibleCards = 1;
      this.cardSpacing = 0;
      this.cardRotation = 0;
      this.cardScaleStep = 0.05;
    } else if (w < 768) {
      this.visibleCards = 3;
      this.cardSpacing = 120;
      this.cardRotation = 3;
      this.cardScaleStep = 0.07;
    } else if (w < 992) {
      this.visibleCards = 3;
      this.cardSpacing = 150;
      this.cardRotation = 3;
      this.cardScaleStep = 0.08;
    } else if (w < 1200) {
      this.visibleCards = 5;
      this.cardSpacing = 160;
      this.cardRotation = 4;
      this.cardScaleStep = 0.08;
    } else {
      this.visibleCards = 5;
      this.cardSpacing = 200;
      this.cardRotation = 4;
      this.cardScaleStep = 0.08;
    }
  }

  updateBackground(): void {
    if (this.singleFilter?.length) {
      const active = this.singleFilter[this.currentIndex];
      this.currentBgImage = active?.thumbnail || this.fallbackImage;
    }
  }

  getCardTransform(index: number): string {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return `translateX(-50%) translateY(-50%) scale(0.8)`;
    }

    let offset = index - this.currentIndex;

    if (offset > Math.floor(this.singleFilter.length / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.singleFilter.length / 2)) {
      offset = offset + this.singleFilter.length;
    }

    const maxOffset = Math.floor(this.visibleCards / 2);
    if (Math.abs(offset) > maxOffset) {
      return `translateX(-50%) translateY(-50%) scale(0.7)`;
    }

    const translateX = offset * this.cardSpacing;
    const rotateY = offset * -this.cardRotation;
    const scale = 1 - Math.abs(offset) * this.cardScaleStep;

    return `translateX(calc(-50% + ${translateX}px)) translateY(-50%) rotateY(${rotateY}deg) scale(${scale})`;
  }

  getCardZIndex(index: number): number {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return 0;
    }

    let offset = index - this.currentIndex;

    if (offset > Math.floor(this.singleFilter.length / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.singleFilter.length / 2)) {
      offset = offset + this.singleFilter.length;
    }

    return this.visibleCards + 1 - Math.abs(offset);
  }

  isCardVisible(index: number): boolean {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return false;
    }

    let offset = index - this.currentIndex;

    if (offset > Math.floor(this.singleFilter.length / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.singleFilter.length / 2)) {
      offset = offset + this.singleFilter.length;
    }

    const maxOffset = Math.floor(this.visibleCards / 2);
    return Math.abs(offset) <= maxOffset;
  }

  scrollCards(direction: 'prev' | 'next') {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return;
    }

    if (direction === 'prev') {
      this.currentIndex = (this.currentIndex - 1 + this.singleFilter.length) % this.singleFilter.length;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.singleFilter.length;
    }
    this.updateBackground();
  }

  canScrollPrev(): boolean {
    return this.singleFilter && this.singleFilter.length > 0;
  }

  canScrollNext(): boolean {
    return this.singleFilter && this.singleFilter.length > 0;
  }

  navigate = (single: any) => {
    let url = single.categoryType
      ? `/where-to-go/category/${single.slug}`
      : `what-to-do/activity/${single.slug}`;
    this.router.navigate([url]);
  };
}
