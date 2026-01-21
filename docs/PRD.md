# 🌍 Global Water Solutions – ERP Web Application

---

## 📌 System Overview

The ERP system is designed to manage and streamline operations for Global Water Solutions. It focuses on customer management, annual maintenance contracts (AMC), payments, complaints, notifications, and financial analytics.

**Core Objectives:**

* Centralized customer & service management
* Automated AMC renewal and tracking
* Pending payment monitoring
* Complaint handling workflow
* Finance analytics dashboard

---

## 🏗️ High-Level Architecture

* **Frontend:** Web-based dashboard for admins, finance team, support, and technicians
* **Backend:** REST APIs handling business logic
* **Database:** Relational database for structured data
* **Background Jobs:** AMC renewal checks & notifications

---

## 🗂️ Project Structure

### Frontend (Web Application)

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── analytics/
│   │   ├── payments/
│   │   ├── customers/
│   │   ├── complaints/
│   │   └── amc/
│   └── auth/
│
├── components/
│   ├── Navbar
│   ├── Sidebar
│   ├── Charts
│   ├── Tables
│   └── Notifications
│
├── services/
│   ├── api
│   ├── customerService
│   ├── paymentService
│   └── analyticsService
│
├── styles/
└── utils/

```

---

### Backend (API Server)

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth
│   │   ├── customer
│   │   ├── service
│   │   ├── amc
│   │   ├── payment
│   │   ├── complaint
│   │   ├── notification
│   │   └── analytics
│   │
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── jobs
│   │   └── amcRenewalJob
│   └── utils
│
├── models / prisma
└── server

```

---

### Database Structure

```
Database
├── customers
├── services
├── amc_contracts
├── payments
├── complaints
├── notifications
├── users
└── finance_logs

```

---

## 🧩 Core Modules

---

### 👤 Customer Module

**Customer Details**

* Name
* Address
* Phone number
* Email
* Linked services

**Customer Table**

* customer_id (PK)
* name
* address
* phone
* email
* created_at

---

### 🔧 Service Module

Tracks services provided to customers such as water purifiers, RO systems, or plants.

**Service Table**

* service_id (PK)
* customer_id (FK)
* service_type
* installation_date

---

### 🔁 AMC (Annual Maintenance Contract)

Manages yearly maintenance contracts with auto-renewal logic.

**AMC Contract Table**

* amc_id (PK)
* customer_id (FK)
* start_date
* end_date
* renewal_date
* amount
* status (ACTIVE / EXPIRED / PENDING_PAYMENT)

---

### 💰 Payment Module

Handles all financial transactions related to AMC and services.

**Payment Table**

* payment_id (PK)
* customer_id (FK)
* amc_id (FK)
* amount
* payment_date
* payment_mode
* status (PAID / PENDING / FAILED)

---

### 🔔 Notification Module

Sends system-generated alerts and reminders.

**Notification Table**

* notification_id (PK)
* customer_id (FK)
* type (AMC_RENEWAL, PAYMENT_DUE, COMPLAINT_UPDATE)
* message
* is_read
* created_at

---

### 🛠️ Complaint Management Module

Handles customer issues and service requests.

**Complaint Table**

* complaint_id (PK)
* customer_id (FK)
* service_id (FK)
* issue_description
* status (OPEN / IN_PROGRESS / RESOLVED)
* created_at

---

### 📊 Finance & Analytics Module

Tracks income and provides business insights.

**Finance Log Table**

* log_id (PK)
* type (INCOME / EXPENSE)
* reference_id
* amount
* created_at

**Analytics Includes:**

* Monthly revenue
* AMC renewal rate
* Pending payments overview
* Service-wise income

---

## 🔄 System Workflows

---

### 🔁 AMC Renewal Workflow

* Daily background job checks AMC end dates
* If AMC is nearing expiry (e.g., 30 days):
  * Renewal notification sent
* If AMC expires without payment:
  * Status set to PENDING_PAYMENT

---

### 💰 Payment Workflow

* Customer makes payment
* Payment status updated to PAID
* AMC status set to ACTIVE
* Finance log entry created
* Confirmation notification sent

---

### 🔔 Notification Workflow

* Triggered by events (payment due, renewal, complaint update)
* Notification stored in database
* Delivered via dashboard and optional email/SMS

---

### 🛠️ Complaint Workflow

* Customer raises complaint
* Status set to OPEN
* Assigned to technician
* Status updated to IN_PROGRESS
* After resolution, status set to RESOLVED
* Customer notified

---

### 📊 Analytics Workflow

* Payment, AMC, and service data collected
* Aggregated queries run
* Data visualized on dashboard

---

## 🧠 Role-Based Access Control

| Role       | Access Permissions         |
| ---------- | -------------------------- |
| Admin      | Full system access         |
| Finance    | Payments & analytics       |
| Support    | Customers, AMC, complaints |
| Technician | Assigned complaints        |

# 🌍 Global Water Solutions – ERP Web Application

---

## 📌 System Overview

The ERP system is designed to manage and streamline operations for Global Water Solutions. It focuses on customer management, annual maintenance contracts (AMC), payments, complaints, notifications, and financial analytics.

**Core Objectives:**

* Centralized customer & service management
* Automated AMC renewal and tracking
* Pending payment monitoring
* Complaint handling workflow
* Finance analytics dashboard

---

## 🏗️ High-Level Architecture

* **Frontend:** Web-based dashboard for admins, finance team, support, and technicians
* **Backend:** REST APIs handling business logic
* **Database:** Relational database for structured data
* **Background Jobs:** AMC renewal checks & notifications

---

## 🗂️ Project Structure

### Frontend (Web Application)

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── analytics/
│   │   ├── payments/
│   │   ├── customers/
│   │   ├── complaints/
│   │   └── amc/
│   └── auth/
│
├── components/
│   ├── Navbar
│   ├── Sidebar
│   ├── Charts
│   ├── Tables
│   └── Notifications
│
├── services/
│   ├── api
│   ├── customerService
│   ├── paymentService
│   └── analyticsService
│
├── styles/
└── utils/

```

---

### Backend (API Server)

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth
│   │   ├── customer
│   │   ├── service
│   │   ├── amc
│   │   ├── payment
│   │   ├── complaint
│   │   ├── notification
│   │   └── analytics
│   │
│   ├── controllers
│   ├── services
│   ├── routes
│   ├── jobs
│   │   └── amcRenewalJob
│   └── utils
│
├── models / prisma
└── server

```

---

### Database Structure

```
Database
├── customers
├── services
├── amc_contracts
├── payments
├── complaints
├── notifications
├── users
└── finance_logs

```

---

## 🧩 Core Modules

---

### 👤 Customer Module

**Customer Details**

* Name
* Address
* Phone number
* Email
* Linked services

**Customer Table**

* customer_id (PK)
* name
* address
* phone
* email
* created_at

---

### 🔧 Service Module

Tracks services provided to customers such as water purifiers, RO systems, or plants.

**Service Table**

* service_id (PK)
* customer_id (FK)
* service_type
* installation_date

---

### 🔁 AMC (Annual Maintenance Contract)

Manages yearly maintenance contracts with auto-renewal logic.

**AMC Contract Table**

* amc_id (PK)
* customer_id (FK)
* start_date
* end_date
* renewal_date
* amount
* status (ACTIVE / EXPIRED / PENDING_PAYMENT)

---

### 💰 Payment Module

Handles all financial transactions related to AMC and services.

**Payment Table**

* payment_id (PK)
* customer_id (FK)
* amc_id (FK)
* amount
* payment_date
* payment_mode
* status (PAID / PENDING / FAILED)

---

### 🔔 Notification Module

Sends system-generated alerts and reminders.

**Notification Table**

* notification_id (PK)
* customer_id (FK)
* type (AMC_RENEWAL, PAYMENT_DUE, COMPLAINT_UPDATE)
* message
* is_read
* created_at

---

### 🛠️ Complaint Management Module

Handles customer issues and service requests.

**Complaint Table**

* complaint_id (PK)
* customer_id (FK)
* service_id (FK)
* issue_description
* status (OPEN / IN_PROGRESS / RESOLVED)
* created_at

---

### 📊 Finance & Analytics Module

Tracks income and provides business insights.

**Finance Log Table**

* log_id (PK)
* type (INCOME / EXPENSE)
* reference_id
* amount
* created_at

**Analytics Includes:**

* Monthly revenue
* AMC renewal rate
* Pending payments overview
* Service-wise income

---

## 🔄 System Workflows

---

### 🔁 AMC Renewal Workflow

* Daily background job checks AMC end dates
* If AMC is nearing expiry (e.g., 30 days):
  * Renewal notification sent
* If AMC expires without payment:
  * Status set to PENDING_PAYMENT

---

### 💰 Payment Workflow

* Customer makes payment
* Payment status updated to PAID
* AMC status set to ACTIVE
* Finance log entry created
* Confirmation notification sent

---

### 🔔 Notification Workflow

* Triggered by events (payment due, renewal, complaint update)
* Notification stored in database
* Delivered via dashboard and optional email/SMS

---

### 🛠️ Complaint Workflow

* Customer raises complaint
* Status set to OPEN
* Assigned to technician
* Status updated to IN_PROGRESS
* After resolution, status set to RESOLVED
* Customer notified

---

### 📊 Analytics Workflow

* Payment, AMC, and service data collected
* Aggregated queries run
* Data visualized on dashboard

---

## 🧠 Role-Based Access Control

| Role       | Access Permissions         |
| ---------- | -------------------------- |
| Admin      | Full system access         |
| Finance    | Payments & analytics       |
| Support    | Customers, AMC, complaints |
| Technician | Assigned complaints        |

# 🗄️ Prisma Schema – Global Water Solutions ERP

This document defines the **complete Prisma database schema** for the Global Water Solutions ERP system. It is designed for **PostgreSQL** and supports customers, services, AMC lifecycle, payments, complaints, notifications, finance analytics, and role-based access.

---

## ⚙️ Prisma Configuration

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

---

## 📘 Enums

### User Roles

```
enum Role {
  ADMIN
  FINANCE
  SUPPORT
  TECHNICIAN
}

```

### AMC Status

```
enum AMCStatus {
  ACTIVE
  EXPIRED
  PENDING_PAYMENT
}

```

### Payment Status

```
enum PaymentStatus {
  PAID
  PENDING
  FAILED
}

```

### Complaint Status

```
enum ComplaintStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}

```

### Notification Type

```
enum NotificationType {
  AMC_RENEWAL
  PAYMENT_DUE
  COMPLAINT_UPDATE
}

```

### Finance Type

```
enum FinanceType {
  INCOME
  EXPENSE
}

```

---

## 👤 User & Role Management

```
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())

  complaints Complaint[] @relation("TechnicianComplaints")
}

```

**Used for:** Admins, finance team, support staff, technicians

---

## 🧑‍💼 Customer Management

```
model Customer {
  id        String   @id @default(uuid())
  name      String
  address   String
  phone     String
  email     String?
  createdAt DateTime @default(now())

  services      Service[]
  amcs          AMCContract[]
  payments      Payment[]
  complaints    Complaint[]
  notifications Notification[]
}

```

---

## 🔧 Services

```
model Service {
  id               String   @id @default(uuid())
  customerId       String
  serviceType      String
  installationDate DateTime

  customer     Customer      @relation(fields: [customerId], references: [id])
  complaints   Complaint[]
  amcContracts AMCContract[]
}

```

---

## 🔁 AMC (Annual Maintenance Contract)

```
model AMCContract {
  id          String    @id @default(uuid())
  customerId  String
  serviceId   String
  startDate   DateTime
  endDate     DateTime
  renewalDate DateTime
  amount      Float
  status      AMCStatus
  createdAt   DateTime  @default(now())

  customer Customer  @relation(fields: [customerId], references: [id])
  service  Service   @relation(fields: [serviceId], references: [id])
  payments Payment[]
}

```

**Supports:** yearly renewal, expiry tracking, pending payment state

---

## 💰 Payments

```
model Payment {
  id          String        @id @default(uuid())
  customerId  String
  amcId       String?
  amount      Float
  status      PaymentStatus
  paymentMode String
  paymentDate DateTime?
  createdAt   DateTime      @default(now())

  customer   Customer     @relation(fields: [customerId], references: [id])
  amc        AMCContract? @relation(fields: [amcId], references: [id])
  financeLog FinanceLog?
}

```

---

## 🛠️ Complaints

```
model Complaint {
  id           String           @id @default(uuid())
  customerId   String
  serviceId    String
  technicianId String?
  description  String
  status       ComplaintStatus
  createdAt    DateTime         @default(now())

  customer   Customer @relation(fields: [customerId], references: [id])
  service    Service  @relation(fields: [serviceId], references: [id])
  technician User?    @relation("TechnicianComplaints", fields: [technicianId], references: [id])
}

```

---

## 🔔 Notifications

```
model Notification {
  id         String           @id @default(uuid())
  customerId String
  type       NotificationType
  message    String
  isRead     Boolean          @default(false)
  createdAt  DateTime         @default(now())

  customer Customer @relation(fields: [customerId], references: [id])
}

```

---

## 📊 Finance & Analytics

```
model FinanceLog {
  id          String      @id @default(uuid())
  type        FinanceType
  referenceId String
  amount      Float
  createdAt   DateTime    @default(now())

  payment Payment? @relation(fields: [referenceId], references: [id])
}

```

**Used for:**

* Revenue tracking
* AMC income analytics
* Financial reporting

---

## 🔄 Relationships Overview

* Customer → Services → AMC → Payments
* Customer → Complaints → Technician
* Payments → Finance Logs
* System Events → Notifications

---

---
