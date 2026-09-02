import {
  Component,
  HostListener,
  AfterViewInit,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


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
export class LandingPageComponent implements OnInit, AfterViewInit {

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

  private programmaticNavigation = false;
  private navigationTimeout?: ReturnType<typeof setTimeout>;


  /* =========================================================
     LIFECYCLE
     ========================================================= */

  ngOnInit(): void {
    this.activeSection = 'home';
  }


  ngAfterViewInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });

    this.activeSection = 'home';
    this.updateActiveIndicator();
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


    const scrollPosition =
      window.scrollY +
      window.innerHeight * 0.25;


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

    const elementTop =
      (element as HTMLElement).getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;


    window.scrollTo({
      top: Math.max(elementTop, 0),
      behavior: 'smooth'
    });


    this.startProgrammaticNavigation(target);
  }


  scrollToTop(): void {
    window.scrollTo({
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

  }

}