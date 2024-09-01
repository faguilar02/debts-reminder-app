import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../auth/auth.service';
import { ButtonModule } from 'primeng/button';


@Component({
  standalone: true,
  imports: [MenubarModule, RouterModule, ButtonModule],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export default class LayoutPageComponent implements OnInit {

  public authService = inject(AuthService)
  private router = inject(Router)
  menuItems = signal<MenuItem[] | undefined>(undefined);

  ngOnInit(): void {
    this.menuItems.set([
      {
        label: 'Nueva Deuda',
        icon: 'pi pi-plus',
        routerLink: 'debts/new-debt',
      },

      {
        label: 'Listado de Deudas',
        icon: 'pi pi-list',
        routerLink: 'debts/debts-list',
      },
    ]);
  }

  logout(){

    this.authService.logout()
    this.router.navigateByUrl('auth/login')


  }

}
