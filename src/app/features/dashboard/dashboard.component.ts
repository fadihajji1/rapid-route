import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Operations</p>
        <h1>Delivery dashboard</h1>
      </div>
      <button class="primary-button">Refresh</button>
    </section>

    <section class="stats-grid">
      @for (stat of stats; track stat.label) {
        <article class="stat-card">
          <span class="label">{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
          <small>{{ stat.meta }}</small>
        </article>
      }
    </section>

    <section class="panel-grid">
      <article class="panel">
        <h2>Recent activity</h2>
        <ul class="list">
          <li><span>Shipment #1240</span><strong>In transit</strong></li>
          <li><span>Delivery #304</span><strong>Assigned</strong></li>
          <li><span>Customer 82</span><strong>Notified</strong></li>
        </ul>
      </article>

      <article class="panel">
        <h2>Gateway status</h2>
        <div class="status-row">
          <span class="dot online"></span>
          <span>API Gateway online</span>
        </div>
        <div class="status-row">
          <span class="dot online"></span>
          <span>Tracking service active</span>
        </div>
        <div class="status-row">
          <span class="dot warning"></span>
          <span>Notification queue health check pending</span>
        </div>
      </article>
    </section>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { label: 'Open shipments', value: '128', meta: '+12 today' },
    { label: 'In delivery', value: '34', meta: '7 urgent' },
    { label: 'Agents online', value: '18', meta: '92% active' },
    { label: 'Notifications', value: '49', meta: '6 unconfirmed' }
  ];
}
