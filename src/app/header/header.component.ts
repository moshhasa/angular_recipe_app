import { Component, EventEmitter, Injectable, OnDestroy, OnInit, Output } from "@angular/core";

import { Subject, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage-service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
    userSub : Subscription;
    isAuthenticated:boolean =  false;

    constructor(private dataStorageSetvice : DataStorageService,private authService : AuthService){}
  
   
    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }


    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe( user => {
            this.isAuthenticated = !user? false : true;
        });
    }

    onSaveData()
    {
        this.dataStorageSetvice.storeRecipes();
    }

    onFetchData()
    {
     
        this.dataStorageSetvice.fetchRecipes().subscribe();
    }

    onLogout()
    {
        this.authService.logout();
    }
}