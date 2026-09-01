## Plan: Angular 21 frontend for this microservice backend

This project already has a strong backend foundation in `README.md`, `00-overview.md`, and `03-roadmap.md`. The best frontend approach is to build a separate Angular 21 app that connects through the Spring API Gateway at port 8080 instead of hitting each microservice directly.

### Recommended architecture
- Frontend app: separate Angular 21 project, outside the Java monorepo
- Backend entry: API Gateway at `http://localhost:8080`
- Auth: JWT-based login from `user-service`
- Business flows:
  - customer and agent management via `user-service`
  - shipment creation/status updates via `shipment-service`
  - delivery assignment/status progression via `delivery-service`
  - tracking timeline via `tracking-service`
  - notifications via `notification-service`

---

## 1. Project structure

Create an Angular app with feature modules like:

- `core`
  - auth guard
  - JWT interceptor
  - API config
  - error handling
- `shared`
  - reusable cards, tables, dialogs, pipes, validators
- `features/auth`
  - login, register, logout
- `features/dashboard`
  - summaries, KPIs, health widgets
- `features/customers`
  - customer list and profile
- `features/shipments`
  - create shipment, list shipments, status update
- `features/deliveries`
  - assign agent, progress delivery
- `features/tracking`
  - shipment timeline view
- `features/notifications`
  - notification feed

---

## 2. Backend connection plan

Use the Gateway as the main integration layer. In local dev, the frontend should point to:

- Gateway: `http://localhost:8080`
- Eureka: `http://localhost:8761` for monitoring only, not UI logic

Recommended mapping:

- `POST /auth/login` → login
- `GET /users/{id}` / `GET /users/agents/available` → customer/agent screens
- `POST /shipments` / `PATCH /shipments/{id}/status` → shipment UI
- `POST /deliveries` / `PATCH /deliveries/{id}/status` → delivery UI
- `GET /tracking/{shipmentId}` → tracking timeline
- `GET /notifications/{userId}` → notifications

For local development, add an Angular proxy config so the app calls `/api/...` and the proxy rewrites to the Gateway. That keeps the frontend clean and avoids hardcoded backend hostnames throughout the code.

---

## 3. Implementation phases

### Phase 1 — Foundation
1. Scaffold Angular 21 app
2. Install Angular Material or a UI library
3. Configure routing and app shell
4. Create environment files:
   - `environment.ts` for local
   - `environment.prod.ts` for deployed backend
5. Add global HTTP interceptor for:
   - JWT bearer token
   - global error handling
   - loading indicators

### Phase 2 — Authentication
1. Login form and token storage
2. Protected routes with guards
3. Role-aware menus
4. Session expiration handling
5. Logout behavior

### Phase 3 — Customer and agent screens
1. Register customer
2. Show agent availability
3. List customers and agents
4. Search and filter

### Phase 4 — Shipment management
1. Shipment creation form
2. Shipment list and detail page
3. Status badges and transitions
4. Validation and error messages

### Phase 5 — Delivery workflow
1. Assign shipment to available agent
2. Delivery assignment form
3. Delivery status progression
4. Agent dashboard

### Phase 6 — Tracking timeline
1. Pull shipment timeline from tracking-service
2. Render event history in readable chronological order
3. Show shipment status changes and timestamps
4. Add status filters

### Phase 7 — Notifications and dashboard
1. Show notification list by user
2. Auto-refresh periodically
3. Dashboard cards for:
   - active shipments
   - assigned deliveries
   - recent updates
   - notification count

### Phase 8 — Quality and deployment
1. Unit tests for services and components
2. Integration tests for key flows
3. Production build verification
4. Docker or Nginx hosting config
5. Environment-specific configuration cleanup

---

## 4. Suggested technical choices

- Angular version: 21
- UI: Angular Material
- Forms: reactive forms
- State: RxJS + service layer, add NgRx only if app grows large
- API pattern:
  - `ApiService` base class
  - feature service classes like `ShipmentService`, `TrackingService`, `DeliveryService`
- Error UX:
  - snackbars/toasts
  - consistent API failure mapping
- Security:
  - JWT in Authorization header
  - route guards
  - logout on 401/403

---

## 5. MVP user journey

Start with this vertical slice first:

1. User logs in
2. Customer is created or selected
3. Shipment is created
4. Delivery is assigned
5. Tracking timeline is viewed
6. Notification feed is checked

This is the strongest first demonstration because it proves the full API flow through the Gateway.

---

## 6. Suggested frontend files to create

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/app/core/interceptors/auth.interceptor.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/api.service.ts`
- `src/app/features/auth/login.component.ts`
- `src/app/features/shipments/shipment-list.component.ts`
- `src/app/features/shipments/create-shipment.component.ts`
- `src/app/features/deliveries/delivery-assignment.component.ts`
- `src/app/features/tracking/tracking-timeline.component.ts`
- `src/app/features/notifications/notifications.component.ts`

---

## 7. Risks and mitigation

- Risk: wrong backend URL or gateway not started
  - Mitigation: centralize config in `environment.*` and validate with browser network tab
- Risk: JWT expiry
  - Mitigation: auth interceptor + route guard + session redirect
- Risk: mismatch between Angular DTOs and backend JSON shape
  - Mitigation: model payloads carefully and validate with API request collections
- Risk: overly large UI logic in components
  - Mitigation: keep business logic in services and feature-specific state managers

---

## 8. Verification checklist

Before calling the frontend done, confirm:

- Angular app builds successfully
- Login works against the backend
- Shipment creation works through the Gateway
- Delivery assignment works
- Tracking timeline renders correctly
- Notifications load from backend
- Protected routes redirect correctly
- Production config points to the right host

---

## 9. Best next step

The most effective starting point is:

1. set up Angular 21 app
2. connect to the API Gateway
3. implement login
4. create shipment
5. view shipment tracking

This gives a working end-to-end slice with minimal backend risk.

I also saved a more detailed version of this plan in the session memory at memories/session/plan.md. If you want, I can continue by producing the exact Angular 21 folder structure and starter files for this project next.