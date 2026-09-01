import { Component } from '@angular/core';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  template: `
    <section class="page-header">
      <div>
        <p class="eyebrow">Shipments</p>
        <h1>Shipment list</h1>
      </div>
      <button class="primary-button">Create shipment</button>
    </section>

    <section class="table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Assigned agent</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          @for (shipment of shipments; track shipment.id) {
            <tr>
              <td>#{{ shipment.id }}</td>
              <td>{{ shipment.customer }}</td>
              <td><span class="status">{{ shipment.status }}</span></td>
              <td>{{ shipment.agent }}</td>
              <td>{{ shipment.updated }}</td>
            </tr>
          }
        </tbody>
      </table>
    </section>
  `,
  styleUrl: './shipment-list.component.scss'
})
export class ShipmentListComponent {
  shipments = [
    { id: 1042, customer: 'Alice Brown', status: 'In transit', agent: 'Mark H.', updated: '2 min ago' },
    { id: 1043, customer: 'David Lee', status: 'Out for delivery', agent: 'Emma S.', updated: '11 min ago' },
    { id: 1044, customer: 'Sofia Clark', status: 'Created', agent: 'Unassigned', updated: '26 min ago' }
  ];
}
