import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserInteractionData {
  timestamp: Date;
  pageUrl: string;
  eventType: 'visit' | 'click' | 'scroll' | 'hover';
  elementType?:
    | 'button'
    | 'link'
    | 'input'
    | 'form'
    | 'menu'
    | 'dropdown'
    | 'checkbox'
    | 'radio'
    | 'other';
  elementId?: string;
  elementLabel?: string;
  additionalContext?: {
    buttonAction?: string;
    inputType?: string;
    formName?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserMonitoringService {
  private interactionsSubject = new BehaviorSubject<UserInteractionData[]>([]);
  interactions$: Observable<UserInteractionData[]> =
    this.interactionsSubject.asObservable();

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    this.trackPageClicks();
  }

  private trackPageClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const shouldTrack =
        target.closest('[data-track]') ||
        ['BUTTON', 'A', 'INPUT', 'FORM'].includes(target.tagName) ||
        target.getAttribute('onclick');

      if (!shouldTrack) return;
      const getElementType = (
        el: HTMLElement
      ): UserInteractionData['elementType'] => {
        if (el.tagName.toLowerCase() === 'button') return 'button';
        if (el.tagName.toLowerCase() === 'a') return 'link';
        if (el.tagName.toLowerCase() === 'input') return 'input';
        if (el.tagName.toLowerCase() === 'form') return 'form';
        return 'other';
      };

      const getElementLabel = (el: HTMLElement): string => {
        if (el.textContent?.trim()) return el.textContent.trim();
        if (el.getAttribute('aria-label'))
          return el.getAttribute('aria-label')!;
        if (el.getAttribute('title')) return el.getAttribute('title')!;
        return el.tagName.toLowerCase();
      };

      const getAdditionalContext = (el: HTMLElement) => {
        const context: UserInteractionData['additionalContext'] = {};

        if (el.tagName.toLowerCase() === 'button') {
          if (el.classList.contains('add-to-cart')) {
            context.buttonAction = 'add-to-cart';
          } else if (el.classList.contains('submit')) {
            context.buttonAction = 'submit';
          }
        }

        if (el.tagName.toLowerCase() === 'input') {
          context.inputType = (el as HTMLInputElement).type;
        }

        return context;
      };

      const clickData: UserInteractionData = {
        timestamp: new Date(),
        pageUrl: window.location.pathname,
        eventType: 'click',
        elementType: getElementType(target),
        elementId: target.id || 'unknown',
        elementLabel: getElementLabel(target),
        additionalContext: getAdditionalContext(target),
      };

      this.addInteraction(clickData);
    });
  }

  private addInteraction(interaction: UserInteractionData) {
    const currentInteractions = this.interactionsSubject.value;
    this.interactionsSubject.next([...currentInteractions, interaction]);
  }
}
