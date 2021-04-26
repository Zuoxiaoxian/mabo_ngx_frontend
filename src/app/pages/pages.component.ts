import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"
      ></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;

  constructor(
    private menuservice: NbMenuService,
    private router:Router
  ){
  }

  ngOnInit(): void {
    //订阅 跳转一级菜单的跳转
    this.menuservice.onSubmenuToggle().subscribe(f=>{
      console.log(f)
      if(f?.item?.link)
        this.router.navigate([f.item.link]);
    })
  }



}
