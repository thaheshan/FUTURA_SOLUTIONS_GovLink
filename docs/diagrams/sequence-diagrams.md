# 🔄 Sequence Diagrams

Below are the detailed sequence diagrams representing different workflows in the system.

---

## 1. Officer Login

![Officer Login](1.1.png)

**Flow:**
1. Officer accesses the Officer Portal via UI.
2. UI sends a `POST /auth/login` request to the API.
3. API forwards credentials to Auth service for verification.
4. Auth service authenticates the officer.
5. A JWT token (officer session) is returned to the API, then to the UI.

---

## 2. View Assigned Applications

![View Assigned Applications](1.2.png)

**Flow:**
1. Officer chooses "View Assigned Applications" in UI.
2. UI calls API: `GET /assignments/my-applications`.
3. API requests officer assignments from AssignS service.
4. AssignS queries DB for records with the officer's ID.
5. Assigned applications list is returned to the API and displayed in UI.

---

## 3. Review Application

![Review Application](2.png)

**Flow:**
1. Officer selects an application to review in the UI.
2. UI calls API: `GET /applications/{id}`.
3. API requests application details from AppS service.
4. AppS queries DB for application, documents, and user info.
5. Complete data is returned and displayed to the officer.

---

## 4. Service Discovery

![Service Discovery Flow](3.1.png)

**Flow:**
1. Citizen browses available services in UI.
2. UI calls API: `GET /services`.
3. API requests active services from AppS.
4. AppS queries DB for services where `is_active = true`.
5. Services list is returned as JSON and displayed to citizen.

---

## 5. Get Service Template

![Get Service Template](3.2.png)

**Flow:**
1. Citizen selects a service and opens the application form.
2. UI calls API: `GET /services/{id}/template`.
3. API requests the form template from AppS.
4. AppS queries DB for templates and form fields.
5. JSON schema is returned and UI renders a dynamic form.

---

## 6. Submit Application + Documents

![Submit Application + Documents](3.3.png)

**Flow:**
1. Citizen submits an application with attached documents.
2. UI sends `POST /applications` with files to API.
3. API validates the user session via Auth service.
4. If valid, API requests AppS to create the application.
5. AppS inserts the application into DB and returns ID.
6. AppS stores document metadata in DocS.
7. DocS uploads file to FileS.
8. DocS records document entry in DB.

---

## 7. Workflow & Assignment

![Workflow & Assignment](3.4.png)

**Flow:**
1. AppS triggers workflow initiation in WorkS.
2. WorkS logs workflow data into DB.
3. DB auto-assigns officer by workload score.
4. Available officers are retrieved and passed to AssignS.
5. AssignS inserts assignment record and updates workload score.

---

## 8. Confirmation Notification

![Confirmation Notification](4.1.png)

**Flow:**
1. AppS requests NotifS to send confirmation.
2. NotifS inserts a notification record into DB.
3. Email/SMS confirmation is sent to citizen.

---

## 9. User Authentication

![User Authentication](4.2.png)

**Flow:**
1. Citizen accesses the platform via UI.
2. UI requests registration form from API.
3. API validates session with Auth service.
4. If session is invalid, login/register page is displayed.

---

## 10. User Registration

![User Registration](4.3.png)

**Flow:**
1. Citizen submits registration form.
2. UI sends `POST /auth/register` to API.
3. API calls Auth service to create user account.
4. Auth inserts user and citizen profile into DB.
5. DB confirms creation.
6. Auth triggers NotifS to send welcome notification.

---

## 11. Generate & Store Final Documents

![Generate & Store Final Documents](4.4.png)

**Flow:**
1. AppS requests DocS to generate the final document (e.g., certificate).
2. DocS stores the completion certificate in FileS.
3. File path is returned.
4. Citizen receives a download link via email or portal.

---

## 12. Mark Application as Completed

![Mark Application as Completed](4.5.png)

**Flow:**
1. Officer completes application processing.
2. UI sends `PUT /applications/{id}/complete` to API.
3. AppS updates application status in DB and logs workflow completion.
4. Officer workload is updated.
5. NotifS sends completion notification to citizen.

---

## 13. Payment Request Generation

![Payment Request Generation](5.1.png)

**Flow:**
1. Officer approves application requiring payment.
2. UI sends `PUT /applications/{id}/approve` to API.
3. AppS requests PayS to calculate service fee.
4. PayS queries DB for the fee amount.
5. Payment record is inserted into DB.
6. NotifS sends payment request to citizen.

---

## 14. Payment Execution & Confirmation

![Payment Execution & Confirmation](5.2.png)

**Flow:**
1. Citizen initiates payment in UI.
2. API calls PayS to create a payment session.
3. ExtPay returns payment gateway URL.
4. Citizen completes payment.
5. Payment webhook updates DB.
6. AppS updates application payment status and triggers workflow step.
7. NotifS sends payment success notification.

---

## 15. Citizen Books Appointment

![Citizen Books Appointment](6.1.png)

**Flow:**
1. Citizen requests available slots from UI.
2. UI calls API: `GET /appointments/available-slots`.
3. AppS queries DB for time slots.
4. Slots are displayed to the citizen.
5. Citizen confirms booking.
6. API inserts appointment in DB.
7. NotifS sends confirmation to officer and citizen.

---

## 16. Officer Requests Appointment

![Officer Requests Appointment](6.2.png)

**Flow:**
1. Officer schedules appointment via UI.
2. UI sends `POST /appointments/schedule` to API.
3. AppS creates appointment requirement.
4. NotifS sends notification to citizen.

---

## 17. Start Chat Session

![Start Chat Session](7.1.png)

**Flow:**
1. Citizen starts chat for an application.
2. UI sends `POST /chat/sessions` to API.
3. ChatS creates chat session and stores in DB.
4. Assigned officer is retrieved.
5. New chat notification is pushed to officer.

---

## 18. Exchange Messages

![Exchange Messages](7.2.png)

**Flow:**
1. Citizen sends message in UI.
2. UI sends WebSocket message to ChatS.
3. Message is stored in DB and pushed in real-time to officer.
4. Officer replies via WebSocket.
5. Reply is stored in DB and sent in real-time to citizen.

---

## 19. Update Application Status

![Update Application Status](8.1.png)

**Flow:**
1. Officer updates application status.
2. UI sends `PUT /applications/{id}/status` to API.
3. AppS updates DB.
4. NotifS sends status update notification to citizen.

---

## 20. Verify Documents

![Verify Documents](8.2.png)

**Flow:**
1. Officer verifies documents in UI.
2. UI sends `PUT /documents/{id}/verify` to API.
3. DocS updates verification status in DB.
4. WorkS logs workflow step progression.

---

## 21. Submit Feedback

![Submit Feedback](9.1.png)

**Flow:**
1. Citizen provides service rating via UI.
2. UI sends `POST /applications/{id}/feedback` to API.
3. AppS updates appointment feedback and rating in DB.

---

## 22. Update Performance Metrics

![Update Performance Metrics](9.2.png)

**Flow:**
1. AppS calculates aggregate officer performance metrics.
2. Updates stored in DB.
3. API sends a thank you message to UI.

---

## 23. Audit Trail (Continuous)

![Audit Trail](10.1.png)

**Flow:**
1. Every action in the system triggers a DB insert into `audit_logs` with application ID, actor, action details, timestamps, and metadata.

---

## 24. View Admin Dashboard

![View Admin Dashboard](10.2.png)

**Flow:**
1. Admin accesses dashboard in UI.
2. UI calls API: `GET /admin/dashboard`.
3. API validates admin permissions with Auth service.
4. If granted, AppS retrieves system statistics from DB.
5. Dashboard metrics are returned and rendered.

---

## 25. Generate Performance Report

![Generate Performance Report](11.1.png)

**Flow:**
1. Admin requests report generation.
2. UI sends `POST /admin/reports/generate` to API.
3. AppS runs complex analytics queries on DB.
4. Report file (PDF/Excel) is generated and stored in FileS.
5. NotifS sends "report ready" notification.

<img width="1202" height="393" alt="4 4" src="https://github.com/user-attachments/assets/b52d1131-2e27-47f6-a912-e0d0971104f2" />
<img width="1287" height="411" alt="4 5" src="https://github.com/user-attachments/assets/2c619e25-024a-4944-909e-3572fbc30ca9" />
<img width="1319" height="491" alt="5 1" src="https://github.com/user-attachments/assets/20a31b1f-feaa-49a8-aec1-1499bcd1a33f" />
<img width="961" height="703" alt="5 2" src="https://github.com/user-attachments/assets/deb377d7-1033-49ce-9246-1a8ee429ac0d" />
<img width="1200" height="383" alt="6 1" src="https://github.com/user-attachments/assets/df11b2dc-e4d0-4f23-8d7c-cbbaecbfa994" />
<img width="1294" height="723" alt="6 2" src="https://github.com/user-attachments/assets/ab599054-08f8-4892-b6ae-acb68bc3b612" />
<img width="1187" height="420" alt="7 1" src="https://github.com/user-attachments/assets/05671941-656e-4cd7-9383-6893da86c9a1" />
<img width="1194" height="678" alt="7 2" src="https://github.com/user-attachments/assets/0093ffef-842a-4050-a09c-39419165d3b0" />
<img width="1315" height="418" alt="8 1" src="https://github.com/user-attachments/assets/48909845-c7b0-4b72-8be1-495d289a2c63" />
<img width="776" height="339" alt="8 2" src="https://github.com/user-attachments/assets/480f46b0-95d6-4b38-a971-33e32aa5d41c" />
<img width="1057" height="343" alt="9 1" src="https://github.com/user-attachments/assets/ca372431-f253-46d0-ac39-d1f55f1306a3" />
<img width="977" height="403" alt="9 2" src="https://github.com/user-attachments/assets/e95cd8d0-15dd-446b-838f-e19a6e25901b" />
<img width="1145" height="525" alt="10 1" src="https://github.com/user-attachments/assets/5636742f-68be-42de-a800-edb75ded5a80" />
<img width="1284" height="587" alt="10 2" src="https://github.com/user-attachments/assets/e5fbc54e-98a6-4915-ab48-907f5280d936" />
<img width="807" height="357" alt="11 1" src="https://github.com/user-attachments/assets/4341bdb5-fcba-4ff7-b579-2aa9284a7fc0" />
<img width="874" height="502" alt="1 1" src="https://github.com/user-attachments/assets/9d0722cb-df4a-4b81-a32e-cdd18b624cc3" />
<img width="1247" height="553" alt="1 2" src="https://github.com/user-attachments/assets/99d2cfbc-f803-4e2e-b016-b7780cc022de" />
<img width="1206" height="533" alt="2" src="https://github.com/user-attachments/assets/4497e358-5da9-478d-93ec-51aae9bbc5b0" />
<img width="1244" height="584" alt="3 1" src="https://github.com/user-attachments/assets/80b78dc6-8208-4c31-b540-25b9c1a25d07" />
<img width="1275" height="672" alt="3 2" src="https://github.com/user-attachments/assets/76847c28-b51c-4092-a76c-33a448c07913" />
<img width="1117" height="542" alt="3 3" src="https://github.com/user-attachments/assets/be9c2035-b0ec-4b55-967d-e53038e42742" />
<img width="825" height="414" alt="3 4" src="https://github.com/user-attachments/assets/9c66ce97-a7b0-49ee-a9e1-9c7bf147b0bd" />
<img width="1107" height="594" alt="4 1" src="https://github.com/user-attachments/assets/d5d6f350-b331-4f0b-971b-dec0e9a65902" />
<img width="1085" height="446" alt="4 2" src="https://github.com/user-attachments/assets/b19e2c90-05a7-46fc-848f-ccbb0d4522f5" />
<img width="1225" height="582" alt="4 3" src="https://github.com/user-attachments/assets/58ce2ad7-e2dd-496f-bb99-aa69c7fa6048" />
