# Utility Billing System

A full-stack utility billing management system built with .NET Core and Angular.

## Features
- Customer/Consumer management
- Meter readings tracking
- Bill generation and management
- Tariff management
- Payment processing
- Notifications system

## Tech Stack
- **Backend:** ASP.NET Core Web API
- **Frontend:** Angular
- **Database:** SQL Server
- **ORM:** Entity Framework Core

## Prerequisites
Before running this project, make sure you have the following installed:
- [.NET SDK 6.0+](https://dotnet.microsoft.com/download)
- [Node.js (v16+) and npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Angular CLI](https://angular.io/cli) - `npm install -g @angular/cli`

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/aryan2882/Capstone_Project.git
cd Capstone_Project
```

### 2. Database Setup
1. Open SQL Server Management Studio (SSMS)
2. Create a new database named `UtilityBillingDB`
3. Update the connection string in `Backend/UtilityBillingSystem.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=UtilityBillingDB;Trusted_Connection=true;"
}
```
4. Run migrations to create database tables

### 3. Backend Setup
```bash
cd Backend/UtilityBillingSystem.API
dotnet restore
dotnet ef database update  # If using migrations
dotnet run
```
The API will run at: `https://localhost:7xxx` or `http://localhost:5xxx`

### 4. Frontend Setup
```bash
cd utility-billing-system
npm install
ng serve
```
The Angular app will run at: `http://localhost:4200`

## Running the Application

1. **Start the Backend:**
```bash
   cd Backend/UtilityBillingSystem.API
   dotnet run
```

2. **Start the Frontend:**
```bash
   cd utility-billing-system
   ng serve
```

3. Open your browser and navigate to `http://localhost:4200`


Default Login Credentials
Admin:
```bash
•	Email: admin@utilitybilling.com
•	Password: Admin@123
```


## Database Schema
The database includes the following main tables:
- Users
- Consumers
- Connections
- MeterReadings
- Bills
- Payments
- Tariffs
- Notifications

See Database Diagram in SSMS for complete schema visualization.
![database_diagram](https://github.com/user-attachments/assets/3478fc89-0d74-4ef7-a924-d030a2192e14)


Here are some UI Screenshots

Admin Dashboard
<img width="1583" height="814" alt="image" src="https://github.com/user-attachments/assets/ad543d9d-acdb-43cd-a6ae-bca2be57a2b3" />

BillingOfficer Dashboard
<img width="1624" height="815" alt="image" src="https://github.com/user-attachments/assets/d3f06ac7-4114-4a4b-86ad-e6fc0f4d571b" />

AccountOfficer Dashboard
<img width="1568" height="792" alt="image" src="https://github.com/user-attachments/assets/bc0dfe2f-cbf7-42e1-b2c1-aeedf82f5072" />

Consumer Dashboard
<img width="1561" height="789" alt="image" src="https://github.com/user-attachments/assets/611a3f01-0e66-42b1-b1d0-7e66696da421" />
