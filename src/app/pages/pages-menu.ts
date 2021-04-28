/*
 * @Author: Zhang Hengye
 * @Date: 2020-11-04 10:55:43
 * @LastEditors: Zhang Hengye
 * @LastEditTime: 2021-04-02 14:48:37
 */
import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Test_module',
  //   icon: 'cube-outline',
  //   link: '/pages/test_module',
  // },
  // {
  //   title: 'tv_mat_espec_video',
  //   icon: 'cube-outline',
  //   link: '/pages/tv_mat_espec_video_crop_1',
  // },
  {
    title: '视觉辅助系统',
    icon: 'film-outline',
    // link: '/pages/video_process/stream',
    link: '',
    children:[
      // {
      //   title: '视频配置',
      //   icon: 'film-outline',
      //   link: '/pages/video-config',
      // },
      {
        title: '工作台',
        icon: 'film-outline',
        link: '/pages/work-bench',
      },
      
      {
        title: '检测设置',
        icon: 'film-outline',
        link: '/pages/test-process',
      },
      {
        title: '通用设置',
        icon: 'film-outline',
        link:'',
        // link: '/pages/general_settings',
        children:[
          {
            title: '摄像头',
            icon: 'film-outline',
            link: '/pages/general_settings/camera',
          }
        ]
      },
    ],
  },
  
  
  
];
