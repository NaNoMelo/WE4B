import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { AdminPage } from './admin-page/admin-page';
import { Cours } from './cours/cours';
import { CourseParticipant } from './course-participant/course-participant';
import { CreateUe } from './create-ue/create-ue';
import { EditUe } from './edit-ue/edit-ue';
import { CreateUser } from './create-user/create-user';
import { EditUser } from './edit-user/edit-user';
import { PostEdit } from './post-edit/post-edit';
import { AdminGuard } from './guards/admin.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { NonAdminGuard } from './guards/non-admin.guard';
import { DashboardGuard } from './guards/dashboard.guard';
import { AuthGuard } from './guards/auth.guard';
import { Logout } from './logout/logout';
import { Logs } from './logs/logs';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AssignmentComponent } from './assignment/assignment';

export const routes: Routes = [
  { path: '', canActivate: [AuthGuard], children: [] },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [DashboardGuard] },
  { path: 'profile', component: Profile },
  { path: 'admin-gestion', component: AdminPage, canActivate: [AdminGuard] },
  { path: 'cours/:id', component: Cours },
  { path: 'course/:id', component: Cours },
  { path: 'course/:id/participants', component: CourseParticipant, canActivate: [TeacherGuard] },
  { path: 'assignment/:id', component: AssignmentComponent, canActivate: [NonAdminGuard] },
  { path: 'create-ue', component: CreateUe, canActivate: [AdminGuard] },
  { path: 'edit-ue/:id', component: EditUe, canActivate: [AdminGuard] },
  { path: 'create-user', component: CreateUser, canActivate: [AdminGuard] },
  { path: 'edit-user/:id', component: EditUser, canActivate: [AdminGuard] },
  { path: 'post-edit/:id', component: PostEdit, canActivate: [TeacherGuard] },
  { path: 'logout', component: Logout},
  { path: 'logs', component: Logs, canActivate: [AdminGuard] },
  { path: 'logs/user/:userId', component: Logs, canActivate: [AdminGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [AdminGuard]}
];
