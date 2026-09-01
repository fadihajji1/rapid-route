import { Component } from '@angular/core';

@Component({
  selector: 'app-tracking',
  standalone: true,
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Tracking</p>
        <h1>Shipment timeline</h1>
      </div>
    </section>

    <section class="timeline-card">
      @for (event of events; track event.id) {
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <strong>{{ event.title }}</strong>
            <span>{{ event.message }}</span>
            <small>{{ event.time }}</small>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  events = [
    { id: 1, title: 'Shipment created', message: 'Order accepted and assigned to the logistics queue.', time: '08:15 AM' },
    { id: 2, title: 'Package picked up', message: 'Package successfully collected by the courier.', time: '09:42 AM' },
    { id: 3, title: 'In transit', message: 'Shipment is moving through the regional distribution hub.', time: '11:05 AM' },
    { id: 4, title: 'Out for delivery', message: 'The final delivery route has been assigned to an agent.', time: '02:18 PM' }
  ];
}
