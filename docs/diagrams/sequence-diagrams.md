# 🔄 Sequence Diagrams

![Sequence Diagram](sequence-diagram.png)

## 1. User Login & Dashboard
1. User enters NIC + mobile number
2. System sends OTP
3. API verifies credentials
4. Database checks user role
5. Dashboard data is fetched
6. Real-time updates via WebSocket

## 2. Application Submission
1. User fills NIC reissue form
2. Uploads documents
3. Submits application
4. API validates & stores data
5. Generates **unique reference ID**
6. QR code is created
7. Push notification sent

## 3. Admin Review
1. Admin logs in
2. Sees pending applications
3. Reviews documents
4. Assigns to officer
5. Updates status
6. Citizen gets notification