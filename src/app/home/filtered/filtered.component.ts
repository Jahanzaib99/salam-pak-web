import { Component, OnInit, Input, SimpleChanges, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtered',
  templateUrl: './filtered.component.html',
  styleUrls: ['./filtered.component.scss'],
})
export class FilteredComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() singleFilter: Array<any>;
  @Input() images: Array<any>;
  @Input() isWhereToGo: boolean;
  redirectUrl: string;
  currentIndex: number = 0;
  visibleCards: number = 5; // Show 5 cards at once
  
  constructor(private router: Router) {
    if (this.isWhereToGo) {
      // this.redirectUrl = `what-to-do/${}`
    }
  }

  ngOnInit(): void {
    this.updateVisibleCards();
  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateVisibleCards();
  }
  
  updateVisibleCards(): void {
    if (window.innerWidth < 768) {
      this.visibleCards = 2;
    } else if (window.innerWidth < 992) {
      this.visibleCards = 3;
    } else {
      this.visibleCards = 5;
    }
  }

  getCardTransform(index: number): string {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return `translateX(-50%) translateY(-50%) scale(0.8)`;
    }
    
    // Calculate offset with infinite loop support
    let offset = index - this.currentIndex;
    
    // Handle wrapping for infinite loop
    if (offset > Math.floor(this.visibleCards / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.visibleCards / 2)) {
      offset = offset + this.singleFilter.length;
    }
    
    // Calculate relative position from center
    const relativeOffset = offset;
    
    // Hide cards that are too far from center
    const maxOffset = Math.floor(this.visibleCards / 2);
    if (Math.abs(relativeOffset) > maxOffset) {
      return `translateX(-50%) translateY(-50%) scale(0.8)`;
    }
    
    // Create overlapping 3D effect - cards overlap horizontally
    // Center card (offset 0) is at position 0
    // Cards to the left have negative offset, cards to the right have positive offset
    const translateX = relativeOffset * -70; // Overlap cards by 70px (reduced for better spacing like Gujarat Tourism)
    const rotateY = relativeOffset * 4; // Slight rotation for 3D effect
    const scale = 1 - Math.abs(relativeOffset) * 0.1; // Scale down cards on sides
    
    return `translateX(calc(-50% + ${translateX}px)) translateY(-50%) rotateY(${rotateY}deg) scale(${scale})`;
  }
  
  getCardZIndex(index: number): number {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return 0;
    }
    
    // Calculate offset with infinite loop support
    let offset = index - this.currentIndex;
    
    // Handle wrapping for infinite loop
    if (offset > Math.floor(this.visibleCards / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.visibleCards / 2)) {
      offset = offset + this.singleFilter.length;
    }
    
    const relativeOffset = Math.abs(offset);
    
    // Center card (offset 0) has highest z-index
    // Cards further from center have lower z-index
    return this.visibleCards - relativeOffset;
  }
  
  isCardVisible(index: number): boolean {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return false;
    }
    
    // Calculate offset with infinite loop support
    let offset = index - this.currentIndex;
    
    // Handle wrapping for infinite loop
    if (offset > Math.floor(this.visibleCards / 2)) {
      offset = offset - this.singleFilter.length;
    } else if (offset < -Math.floor(this.visibleCards / 2)) {
      offset = offset + this.singleFilter.length;
    }
    
    const maxOffset = Math.floor(this.visibleCards / 2);
    
    // Show cards within the visible range (center ± maxOffset)
    return Math.abs(offset) <= maxOffset;
  }

  scrollCards(direction: 'prev' | 'next') {
    if (!this.singleFilter || this.singleFilter.length === 0) {
      return;
    }
    
    // Infinite loop carousel
    if (direction === 'prev') {
      this.currentIndex = (this.currentIndex - 1 + this.singleFilter.length) % this.singleFilter.length;
    } else if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.singleFilter.length;
    }
  }
  
  canScrollPrev(): boolean {
    // Always enabled for infinite loop
    return this.singleFilter && this.singleFilter.length > 0;
  }
  
  canScrollNext(): boolean {
    // Always enabled for infinite loop
    return this.singleFilter && this.singleFilter.length > 0;
  }

  navigate = (single: any) => {
    let url = single.categoryType
      ? `/where-to-go/category/${single.slug}`
      : `what-to-do/activity/${single.slug}`;
    this.router.navigate([url]);
  };
}
