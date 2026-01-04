<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/2b777a60-27d1-40ee-8a96-2ff85b6b4746" /># Utility Billing System

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
•	Email: admin@utilitybilling.com
•	Password: Admin@123


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


