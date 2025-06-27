import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminPage } from './admin-page/admin-page';
import { Cours } from './cours/cours';
import { CourseParticipant } from './course-participant/course-participant';
import { CreateUe } from './create-ue/create-ue';
import { EditUe } from './edit-ue/edit-ue';
import { CreateUser } from './create-user/create-user';
import { EditUser } from './edit-user/edit-user';
import { PostEdit } from './post-edit/post-edit';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'admin', component: AdminDashboard },
  { path: 'admin-page', component: AdminPage },
  { path: 'cours/:id', component: Cours },
  { path: 'course/:id', component: Cours },
  { path: 'course/:id/participants', component: CourseParticipant },
  { path: 'create-ue', component: CreateUe },
  { path: 'edit-ue/:id', component: EditUe },
  { path: 'create-user', component: CreateUser },
  { path: 'edit-user/:id', component: EditUser },
  { path: 'post-edit/:id', component: PostEdit },
  { path: 'logout', redirectTo: '/login', pathMatch: 'full' }
];
