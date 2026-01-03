import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';
import {  LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { UserRole } from './core/models/user';
import { UsersComponent } from './features/admin/users/users';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout';
import { UtilityTypesComponent } from './features/admin/utility-types/utility-types/utility-types';
import { BillingCyclesComponent } from './features/admin/billing-cycles/billing-cycles/billing-cycles';
import { TariffsComponent } from './features/admin/tariffs/tarrifs/tarrifs';
import { ConnectionsComponent } from './features/admin/connections/connections/connections';
import { BillingOfficerLayoutComponent } from './features/billing-officer/billing-officer-layout/billing-officer-layout';
import { MeterReadingCreateComponent } from './features/billing-officer/meter-readings/meter-reading-create/meter-reading-create';
import { MeterReadingListComponent } from './features/billing-officer/meter-readings/meter-reading-list/meter-reading-list';
import { DashboardComponent } from './features/billing-officer/dashboard/dashboard';
import { BillListComponent } from './features/billing-officer/bill-list/bill-list';
import { ConsumerLayoutComponent } from './features/consumer/consumer-layout/consumer-layout';
import { ConsumerDashboardComponent } from './features/consumer/dashboard/dashboard';
import { MyBillsComponent } from './features/consumer/my-bills/my-bills';
import { MyProfileComponent } from './features/consumer/my-profile/my-profile';
import { MyConnectionsComponent } from './features/consumer/my-connections/my-connections';
import { ConsumptionReportComponent } from './features/consumer/consumption-report/consumption-report';
import { MakePaymentComponent } from './features/consumer/make-payment/make-payment';
import { PaymentHistoryComponent } from './features/consumer/payment-history/payment-history';
import { AccountOfficerLayoutComponent } from './features/account-officer/account-officer-layout/account-officer-layout';
import { AccountOfficerDashboardComponent } from './features/account-officer/account-officer-dashboard/account-officer-dashboard';
import { ConsumersComponent } from './features/account-officer/consumer/consumer';
import { BillsComponent } from './features/account-officer/bills/bills';
import { OutstandingBillsComponent } from './features/account-officer/outstanding-bills/outstanding-bills';
import { PaymentsComponent } from './features/account-officer/payments/payments';
import { ReportsComponent } from './features/account-officer/reports/reports';
import { RecordPaymentComponent } from './features/account-officer/record-payment/record-payment';
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Admin Routes
  {
    path: 'admin',
    component:AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.Admin] },
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent },
            { path: 'utility-types', component: UtilityTypesComponent },
            { path: 'billing-cycles', component: BillingCyclesComponent },
          { path: 'tariffs', component: TariffsComponent },
            { path: 'connections', component: ConnectionsComponent }




      // Add more admin routes here
    ]
  },

//   // Billing Officer Routes
    
  // Billing Officer Routes
{
  path: 'billing-officer',
  component: BillingOfficerLayoutComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: [UserRole.BillingOfficer] },
  children: [
    { path: '', redirectTo: 'meter-readings/dashboard', pathMatch: 'full' },

    {
      path: 'meter-readings',
      children: [
        { path: '', component: MeterReadingListComponent },
        { path: 'add', component: MeterReadingCreateComponent },
        {path:'dashboard',component:DashboardComponent},
            { path: 'bills', component: BillListComponent }

      ]
    }
  ]
},

//   // Account Officer Routes
//   {
//     path: 'account-officer',
//     canActivate: [AuthGuard, RoleGuard],
//     data: { roles: [UserRole.AccountOfficer] },
//     children: [
//       { path: 'dashboard', component: () => import('./features/account-officer/dashboard/dashboard').then(m => m.DashboardComponent) },
//       // Add more account officer routes
//     ]
//   },

//   // Consumer Routes
 {
  path: 'consumer',
  component: ConsumerLayoutComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: [UserRole.Consumer] },
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: ConsumerDashboardComponent },
    { path: 'bills', component: MyBillsComponent },
    { path: 'profile', component: MyProfileComponent },
    { path: 'connections', component: MyConnectionsComponent },
    { path: 'consumption', component: ConsumptionReportComponent },
    { path: 'make-payment', component: MakePaymentComponent },        // NEW
    { path: 'payment-history', component: PaymentHistoryComponent },
    // Payment routes (for later)
    // { path: 'payments', component: PaymentsComponent },
    // { path: 'payment-history', component: PaymentHistoryComponent }
  ]
},
{
  path: 'account-officer',
  component: AccountOfficerLayoutComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: [UserRole.AccountOfficer] }, // UserRole.AccountOfficer = 3
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AccountOfficerDashboardComponent },
    
    { path: 'consumers', component: ConsumersComponent },
    { path: 'bills', component: BillsComponent },
    { path: 'outstanding', component: OutstandingBillsComponent },
    { path: 'payments', component: PaymentsComponent },
    { path: 'make-payment', component: RecordPaymentComponent },
    { path: 'reports', component: ReportsComponent }
    // Add these as you create the components:
    // { path: 'consumers', component: ConsumersComponent },
    // { path: 'bills', component: BillsComponent },
    // { path: 'outstanding', component: OutstandingBillsComponent },
    // { path: 'payments', component: PaymentsComponent },
    // { path: 'make-payment', component: MakePaymentComponent },
    // { path: 'reports', component: ReportsComponent }
  ]
},

//   { path: 'unauthorized', component: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '/login' }
];
