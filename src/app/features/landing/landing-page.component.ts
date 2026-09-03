import {
  Component,
  HostListener,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


interface NavItem {
  label: string;
  href: string;
  icon:
    | 'home'
    | 'how-it-works'
    | 'features'
    | 'tracking'
    | 'business'
    | 'about';
}


gsap.registerPlugin(ScrollTrigger);


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {

  /* =========================================================
     NAVIGATION
     ========================================================= */

  navItems: NavItem[] = [
    {
      label: 'Home',
      href: '#home',
      icon: 'home'
    },
    {
      label: 'How It Works',
      href: '#how-it-works',
      icon: 'how-it-works'
    },
    {
      label: 'Features',
      href: '#features',
      icon: 'features'
    },
    {
      label: 'Tracking',
      href: '#tracking',
      icon: 'tracking'
    },
    {
      label: 'For Businesses',
      href: '#business',
      icon: 'business'
    },
    {
      label: 'About',
      href: '#about',
      icon: 'about'
    }
  ];


  /* =========================================================
     STATE
     ========================================================= */

  navbarScrolled = false;

  mobileMenuOpen = false;

  activeSection = 'home';

  activeIndicatorLeft = 0;
  activeIndicatorWidth = 0;
  activeIndicatorReady = false;

  trackingNumber = '';

  constructor(readonly theme: ThemeService) {}

  private programmaticNavigation = false;
  private navigationTimeout?: ReturnType<typeof setTimeout>;
  private animationContext?: gsap.Context;


  /* =========================================================
     LIFECYCLE
     ========================================================= */

  ngOnInit(): void {
    this.activeSection = 'home';
  }


  ngAfterViewInit(): void {
    this.getScrollContainer().scrollTo({
      top: 0,
      behavior: 'auto'
    });

    this.activeSection = 'home';
    this.updateActiveIndicator();
    this.setupTextAnimations();
  }


  ngOnDestroy(): void {
    this.animationContext?.revert();
  }


  private setupTextAnimations(): void {
    const container = this.getScrollContainer();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      return;
    }

    this.animationContext = gsap.context(() => {
      const contentBlocks = container.querySelectorAll<HTMLElement>(
        '.hero-content, .section-heading, .tracking-content, .business-content, .cta-content'
      );

      contentBlocks.forEach((contentBlock, index) => {
        const textElements = contentBlock.querySelectorAll<HTMLElement>(
          ':scope > .hero-badge, :scope > .eyebrow, :scope > h1, :scope > h2, :scope > p, :scope > .hero-actions, :scope > .hero-trust, :scope > .tracking-form, :scope > .business-list, :scope > .cta-actions'
        );

        gsap.from(textElements, {
          y: 32,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          delay: index === 0 ? 0.15 : 0,
          scrollTrigger: {
            trigger: contentBlock,
            scroller: container,
            start: index === 0 ? 'top 85%' : 'top 72%',
            once: true
          }
        });
      });
    }, container);

    ScrollTrigger.refresh();
  }


  /* =========================================================
     WINDOW SCROLL
     ========================================================= */

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateNavbarState();

    if (!this.programmaticNavigation) {
      this.updateActiveSection();
    }
  }


  @HostListener('window:scrollend')
  onWindowScrollEnd(): void {
    this.finishProgrammaticNavigation();
  }


  /* =========================================================
     NAVBAR
     ========================================================= */

  private updateNavbarState(): void {
    this.navbarScrolled = window.scrollY > 30;
  }


  /* =========================================================
     ACTIVE SECTION
     ========================================================= */

  private updateActiveSection(): void {

    const sections = this.navItems
      .map(item => item.href.replace('#', ''))
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);


    const container = this.getScrollContainer();
    const scrollPosition =
      container.scrollTop +
      container.clientHeight * 0.25;

    const cta = document.getElementById('cta');

    if (cta && scrollPosition >= cta.offsetTop) {
      this.activeSection = '';
      this.updateActiveIndicator();
      return;
    }


    let currentSection = 'home';


    for (const section of sections) {

      if (scrollPosition >= section.offsetTop) {
        currentSection = section.id;
      }

    }


    this.activeSection = currentSection;
    this.updateActiveIndicator();
  }


  private updateActiveIndicator(): void {
    requestAnimationFrame(() => {
      const nav = document.querySelector('.navbar-nav');
      const activeLink = document.querySelector('.nav-link.active');

      if (!nav || !activeLink) {
        this.activeIndicatorReady = false;
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      this.activeIndicatorLeft = linkRect.left - navRect.left;
      this.activeIndicatorWidth = linkRect.width;
      this.activeIndicatorReady = true;
    });
  }


  isActive(href: string): boolean {

    const sectionId = href.replace('#', '');

    return this.activeSection === sectionId;
  }


  /* =========================================================
     SMOOTH NAVIGATION
     ========================================================= */

  navigateTo(
    target: string,
    event?: Event
  ): void {

    event?.preventDefault();

    const element = document.querySelector(target);

    if (!element) {
      return;
    }


    this.closeMobileMenu();


    const navbarOffset = 80;
    const container = this.getScrollContainer();

    const elementTop =
      (element as HTMLElement).getBoundingClientRect().top +
      container.scrollTop -
      container.getBoundingClientRect().top -
      navbarOffset;


    container.scrollTo({
      top: Math.max(elementTop, 0),
      behavior: 'smooth'
    });


    this.startProgrammaticNavigation(target);
  }


  scrollToTop(): void {
    this.getScrollContainer().scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.startProgrammaticNavigation('#home');
  }


  private startProgrammaticNavigation(target: string): void {
    this.programmaticNavigation = true;
    this.activeSection = target.replace('#', '');
    this.updateActiveIndicator();

    if (this.navigationTimeout) {
      clearTimeout(this.navigationTimeout);
    }

    this.navigationTimeout = setTimeout(() => {
      this.finishProgrammaticNavigation();
    }, 1000);
  }


  private finishProgrammaticNavigation(): void {
    if (!this.programmaticNavigation) {
      return;
    }

    this.programmaticNavigation = false;
    this.updateActiveSection();
  }


  /* =========================================================
     MOBILE MENU
     ========================================================= */

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    document.body.style.overflow =
      this.mobileMenuOpen
        ? 'hidden'
        : '';
  }


  closeMobileMenu(): void {
    this.mobileMenuOpen = false;

    document.body.style.overflow = '';
  }


  toggleTheme(): void {
    this.theme.toggleTheme();
  }


  /* =========================================================
     TRACKING
     ========================================================= */

  trackPackage(event: Event): void {

    event.preventDefault();


    const trackingId =
      this.trackingNumber.trim();


    if (!trackingId) {
      return;
    }


    /*
     * Replace this with your real tracking route/API call.
     *
     * Example:
     *
     * this.router.navigate([
     *   '/tracking',
     *   trackingId
     * ]);
     *
     * The landing page currently keeps the form
     * independent from your backend.
     */

    console.log(
      'Tracking package:',
      trackingId
    );
  }


  /* =========================================================
     ESCAPE KEY
     ========================================================= */

  @HostListener('document:keydown.escape')
  onEscape(): void {

    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

  }


  /* =========================================================
     RESPONSIVE MENU
     ========================================================= */

  @HostListener('window:resize')
  onWindowResize(): void {

    this.updateActiveIndicator();

    if (
      window.innerWidth > 900 &&
      this.mobileMenuOpen
    ) {
      this.closeMobileMenu();
    }

  }


  /* =========================================================
     CONTAINER SCROLL
     ========================================================= */

  onContainerScroll(event: Event): void {

    const target =
      event.target as HTMLElement | null;


    if (!target) {
      return;
    }


    this.navbarScrolled =
      target.scrollTop > 30;

    if (!this.programmaticNavigation) {
      this.updateActiveSection();
    }

  }


  private getScrollContainer(): HTMLElement {
    return document.querySelector('.landing-page') as HTMLElement;

  }

}