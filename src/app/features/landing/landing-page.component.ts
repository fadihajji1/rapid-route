import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class CustomLandingPageComponent implements OnInit {
  navbarScrolled = false;
  mobileMenuOpen = false;
  activeSection = '#home';

  navItems: NavItem[] = [
    { label: 'Home', href: '#home', icon: 'home' },
    { label: 'About', href: '#about', icon: 'about' },
    { label: 'Services', href: '#services', icon: 'services' },
    { label: 'Portfolio', href: '#portfolio', icon: 'portfolio' },
    { label: 'Contact', href: '#contact', icon: 'contact' }
  ];

  constructor(private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.updateActiveSection();
  }

  onContainerScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.navbarScrolled = target.scrollTop > 50;
    this.updateActiveSection(target);
  }

  navigateTo(href: string, event: Event): void {
    event.preventDefault();
    const elementId = href.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.activeSection = href;
    this.closeMobileMenu();
  }

  isActive(href: string): boolean {
    return this.activeSection === href;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  private updateActiveSection(target?: HTMLElement): void {
    const sections = this.navItems.map(item => item.href.replace('#', ''));
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i]);
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerTop = target ? target.getBoundingClientRect().top : 0;
        if (rect.top - containerTop <= 150) {
          this.activeSection = `#${sections[i]}`;
          return;
        }
      }
    }
    this.activeSection = '#home';
  }
}
