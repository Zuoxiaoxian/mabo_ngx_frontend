import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tv_mat_espec_video_crop_1Component } from './tv_mat_espec_video_crop_1.component';
import { VjsPlayerModule } from '../vjs-player/vjs-player.module'
import {SafePipeModule } from 'safe-pipe'

@NgModule({
  imports: [
    CommonModule,
    VjsPlayerModule,
    SafePipeModule 
    
  ],
  declarations: [Tv_mat_espec_video_crop_1Component]
})
export class Tv_mat_espec_video_crop_1Module { }
