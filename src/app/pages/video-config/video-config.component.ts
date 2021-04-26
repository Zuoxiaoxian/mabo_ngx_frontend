import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { VideoDialogComponent } from './dialog/video-dialog/video-dialog.component';
import { VideoServiceService } from './video-service.service';
import { fabric } from "fabric";
@Component({
  selector: 'app-video-config',
  templateUrl: './video-config.component.html',
  styleUrls: ['./video-config.component.scss']
})
export class VideoConfigComponent implements OnInit {
  object = Object;
  arrayObject = Array;
  _json:any = {
    "video_sources": { // ※ 视频源信息 
        "stream_name": "camera_test", // ※ 视频源名城
        "init_timeout": 30, // 初始化超时
        "origin_url": "http://localhost:80/playlist.m3u8", // ※ 视频源地址
        "stream_transform": "hls", // ※ 视频源类型, 选择: rtsp_direct、hls、rtmp、LocalFile
        "eqpt_no": "camera_test", // ※ 视频源地址
        "current_project_name": "camera_test_202012", // ※ 项目名
    },
    "log": { // 日志配置, 无须前端配置
        "log_file": null,
        "console": true,
        "_level": "DEBUG,INFO,WARNING,ERROR,CRITICAL",
        "console_level": "DEBUG",
        "file": true,
        "file_level": "INFO",
        "enable_debug_log": true,
        "backup_count": 5,
        "max_size": 1024000,
        "format_string": "(%(asctime)s), %(levelname)s, <%(threadName)s>, %(module)s, %(funcName)s, [%(lineno)d]: %(message)s"
    },
    "mongodb": { // 数据库保存, 无须前端配置
        "db_addr": "192.168.252.129:27017",
        "usr": "mabo",
        "password": "testpass",
        "db": "video_process",
        "source_col": "source_table_test",
    },
    "rtsp2hls": { // 视频转换地址, 无须前端配置
        "host": "http://10.7.0.117:9094",
        "proxies": {
            "http": "http://10.7.0.117:2379",
            "https": "http://10.7.0.117:2379",
        }
    },
    // 根据实时效率, 进行一定数量的drop, 无须前端配置
    "drop_setting": {
        // 初始值, 间隔x帧, 分析1帧,  0标示分析所有 
        "initial_drop_interval": 2,
        // 间隔多久更新一次drop,0 表示不进行drop检查
        "recheck_time_interval": 50,
    },
    "crop_setting": { // ※ 关注区域设置
        "crop_mode": "manual", // ※ 默认为None, manual时需要配置 manual_box
        "manual_box": { // ※ manual_box为列表形式, 可以任意添加（有个参数可以设定上限）
            "crop_id_main": [ // ※ 四个int类型参数, 分别为 (x_min, y_min, x_max, y_max)
                381,
                92,
                675,
                391
            ],
            "crop_id_second": [
                675,
                92,
                975,
                491
            ],
        }
        // (x_min, y_min, x_max, y_max), img[y_min:y_max, x_min:x_max]
    },
    "stream_adjust": { // ※ 待机画面调整
        "standby": {
            "no_signal_wait": 60, // ※ 无信号超时, 默认60
            /*
            ※ 检查方式：
                BaseCheck: 默认, 无其它额外判定
                image_check: 通过对比图像来判断是否开启, （暂不开放, 注释掉. ）
                encoder_check: 通过获取encoder的参数判断是否开启
            */
            "check_model": "BaseCheck",
            // image_check 模式时配置 配置：通过图像进行的配置
            "standby_screen": "status_img/compare_running_screen_2.png",
            // 9, 27,
            "resize_width": 27,
            // 8, 24,
            "resize_height": 24,
            "check_interval": 1,
            // 8*8下推荐10, 27*24下为108. . . 308？
            "dhash_same_threshold": 308,
            // ※ encoder_check 模式时配置
            "api_addr": "http://10.7.94.203:2379", // ※ encoder http的配置
            "proxies": { // proxy 测试用项目, 前端不配置
                "http": "http://10.7.0.117:2379",
                "https": "http://10.7.0.117:2379"
            },
            "auth": { // ※ encoder 登陆信息
                "user": "admin",
                "pass": "admin"
            }
        },
        "time": { // 当前帧时间校准, 暂时不配置
            "enable": false,
            // (x_min, y_min, x_max, y_max), img[y_min:y_max, x_min:x_max]
            "time_position": [
                96,
                15,
                403,
                42
            ],
            "tesseract_config": {
                "lang": "chi_sim",
                "config": "--psm 8"
            },
            // 因识别存在一定误差, 主要存在与标点上, 因此对字符格式进行矫正
            "text_adjust_reg": "(\\d{4})\\W{0,3}(\\d{2})\\W{0,3}(\\d{2})\\s?(\\d{2})\\W{0,2}(\\d{2})\\W{0,2}(\\d{2})",
            // 视频中的时间格式
            "time_format": "%Y-%m-%d %H:%M:%S",
            // second
            "update_interval": 10
        }
    },
    "consumer_plugin": { // ※ 图像分析插件配置, 字典型, 暂时开发了两种子模块：save、screen_abnormal
        "save": { // ※ 不进行具体配置, 只做enable、disable的判断. enable传递save键值的空{}, disable 时consumer_plugin中没save键值
            "plugin_file": "save_consumer_plugin", // 不配置, 与save对应, 固定
            "plugin_class": "SaveConsumerPlugin",
            // 存储相关配置
            "storage_setting": {
                // 存储位置, 默认：cache
                "output_path": null,
                // 最大轮转数
                "rotation_number": 5,
                // 所有文件, 最大存储空间：G
                "max_storage_size": 10,
                // 单文件最大存储长度, 单位：min
                "one_file_max_interval": 1,
                // 超限删除检查间隔：min
                "rm_check_interval": 3
            }
        },
        "screen_abnormal": { // ※ 视频异常配置项目
            "plugin_file": "EMC_consumer_plugin",
            "plugin_class": "EMCConsumerPlugin",
            "detect_setting": { // ※ bha模型检测. 
                // bha模型检测, 使用bha距离, 判断帧是否属于已有模型
                // 可能存在多个子项目, 按照添加的形式添加.
                "bha_dist_setting": { // bha距离模型配置.
                    "debug_save_model": false,
                    "reload_model": true, // 重载模型, 前端无需配置
                    "reload_method": "mongodb", // 加载&存储模型的模式：local, mongodb. 后续都使用mongodb, 前端无需配置
                    "reload_path": "local_save",
                    // 参考：0.4 (不带更新), 带更新的话是, 0.2
                    "new_model_threshold": 0.2, // ※ 新模型阈值, 默认0.2
                    // 多线程下画图有问题
                    "draw_hist_jpg": false,
                    // hist of color model
                    // standard_gray: 标准灰度模式
                    // tricolor: 三色比较模式
                    "hist_mode": "tricolor", // ※ 模型比较模式,可选: standard_gray, tricolor
                    "add_first_frame_as_model": true, // 首帧是否为正常模型
                    "is_first_frame_normal": true, // 首帧默认为正常
                    // 是否使用新帧更新距离此帧最近model的hist
                    "update_nearest_model": false,
                    "update_rate": 0.2, // 新帧更新占比
                    // 可以预设一些模型
                    // 若保留完整图片, 注意添加crop
                    "default_model": [],
                    "tmp_model_setting": { // ※ 临时模型设置,默认开启
                        "enable": true,
                        // 如果有n帧都归属于此, 则升级为 per model
                        "tmp_trans_per_thresh": 30, // ※ 临时模型升级阈值,默认30
                        // n帧后无更新, 则从tmp中删除
                        "timeout_delete_frame_cnt": 100, // ※ 临时模型超时阈值,默认100
                    }
                },
                // 动态检测, 判断前几帧与当前帧的帧间差值, 判断是否存在改变
                "dynamic_setting": { // ※ 动态检测
                    "dynamic_thresh": 25, // ※ 动态阈值, 默认 25
                    "min_area": 15000 // ※ 检测变化后最小面积, 默认 15000
                },
                "report_setting": { // ※ 异常上报配置
                    "measurement": "camera_test", // ※ 异常表格
                    "eqpt_no": "local_camera", // ※ eqpt_no
                    "multi_report_enable": true, // 多方式上报,API填充
                    "multi_report_setting": {
                        // "heartbeat_measurement": "camera_test_heartbeat",
                        // "change_measurement": "camera_test_change",
                        "heartbeat_interval": 5,
                        "field_change_check": [
                            "bha_model_idx",
                            "dynamic_sum_area"
                        ],
                        "multi_filter_fields": [
                            "dynamic_c_area",
                            "dynamic_c_boundingRect"
                        ],
                        // 使用类似eval(f'data["{eval_key}"] {eval_value}')的表达式,过滤满足条件的判断
                        // 若满足上eval表达式, 则此改变视为无改变 
                        "multi_filter_eval": {
                            "bha_model_idx": "==-1"
                        }
                    }
                }
            }
        }
    },
    "sender_plugin": { // 将consumer信息传递出去的插件, 前端无需配置, API配置
        "influx_test_send": {
            // 必填
            "plugin_file": "influx_sender",
            "plugin_class": "InfluxSenderPlugin",
            "influx_setting": {
                "host": "192.168.252.129",
                "port": 8086,
                "username": null,
                "password": null,
                "database": "test",
                "timeout": 10,
                "time_precision": "ms",
            }
        },
        // "kafka_test_sender": {
        //     // 必填
        //     "plugin_file": "kafka_sender",
        //     "plugin_class": "KafkaSenderPlugin",
        //     "kafka_setting": {
        //         "bootstrap_servers": "10.203.80.155:9092",
        //         "topic": "custom_collector_json",
        //         "org": 3101,
        //         "dataid": 3502,
        //         "ip": "${DEPLOY_IP}",
        //         "timeout": 10,
        //         "time_precision": "ms",
        //     }
        // }
    }
}
  // _json:any = {
  //   "video_sources": { // ※ 视频源信息 
  //     "stream_name": "camera_test", // ※ 视频源名城
  //     "init_timeout": 30, // 初始化超时
  //     "origin_url": "http://localhost:80/playlist.m3u8", // ※ 视频源地址
  //     "stream_transform": "hls", // ※ 视频源类型, 选择: rtsp_direct、hls、rtmp、LocalFile
  //     "eqpt_no": "camera_test", // ※ 视频源地址
  //     "current_project_name": "camera_test_202012", // ※ 项目名
  //   },
  //   "crop_setting": { // ※ 关注区域设置
  //     "crop_mode": "manual", // ※ 剪裁模式,默认为None, manual时需要配置 manual_box
  //     "manual_box": { // ※ 剪裁范围,manual_box为列表形式, 可以任意添加（有个参数可以设定上限）
  //         "crop_id_main": [ // ※ [用户自己定义的名字],四个int类型参数, 分别为 (x_min, y_min, x_max, y_max)
  //             381,
  //             92,
  //             675,
  //             391
  //         ],
  //         "crop_id_second": [
  //             675,
  //             92,
  //             975,
  //             491
  //         ],
  //     }
  //     // (x_min, y_min, x_max, y_max), img[y_min:y_max, x_min:x_max]
  // },
  //   "stream_adjust": { // ※ 待机画面调整
  //     "standby": {
  //         "no_signal_wait": 60, // ※ 无信号超时, 默认60
  //         /*
  //         ※ 检查方式：
  //             BaseCheck: 默认, 无其它额外判定f
  //             image_check: 通过对比图像来判断是否开启, （暂不开放, 注释掉. ）
  //             encoder_check: 通过获取encoder的参数判断是否开启
  //         */
  //         "check_model": "BaseCheck",
  //         // ※ encoder_check 模式时配置
  //         "api_addr": "http://10.7.94.203:2379", // ※ encoder http的配置
  //         "proxies": { // proxy 测试用项目, 前端不配置
  //             "http": "http://10.7.0.117:2379",
  //             "https": "http://10.7.0.117:2379"
  //         },
  //         "auth": { // ※ encoder 登陆信息
  //             "user": "admin",
  //             "pass": "admin"
  //         }
  //     },
  //   },
  //   "consumer_plugin": { // ※ 图像分析插件配置, 字典型, 暂时开发了两种子模块：save、screen_abnormal
  //     // "save": { // ※ 不进行具体配置, 只做enable、disable的判断. enable传递save键值的空{}, disable 时consumer_plugin中没save键值
  //     // },
  //     "screen_abnormal": { // ※ 视频异常配置项目
  //         "detect_setting": { // ※ bha模型检测. 
  //             // bha模型检测, 使用bha距离, 判断帧是否属于已有模型
  //             // 可能存在多个子项目, 按照添加的形式添加.
  //             "bha_dist_setting": { // bha距离模型配置.
  //                 // 参考：0.4 (不带更新), 带更新的话是, 0.2
  //                 "new_model_threshold": 0.2, // ※ 新模型阈值, 默认0.2
  //                 "hist_mode": "tricolor", // ※ 模型比较模式,可选: standard_gray, tricolor
  //                 "tmp_model_setting": { // ※ 临时模型设置,默认开启
  //                     // 如果有n帧都归属于此, 则升级为 per model
  //                     "tmp_trans_per_thresh": 30, // ※ 临时模型升级阈值,默认30
  //                     // n帧后无更新, 则从tmp中删除
  //                     "timeout_delete_frame_cnt": 100, // ※ 临时模型超时阈值,默认100
  //                 }
  //             },
  //             // 动态检测, 判断前几帧与当前帧的帧间差值, 判断是否存在改变
  //             "dynamic_setting": { // ※ 动态检测
  //                 "dynamic_thresh": 25, // ※ 动态阈值, 默认 25
  //                 "min_area": 15000 // ※ 检测变化后最小面积, 默认 15000
  //             },
  //             "report_setting": { // ※ 异常上报配置
  //                 "measurement": "camera_test", // ※ 异常表格
  //                 "eqpt_no": "local_camera", // ※ eqpt_no
                  
  //             }
  //         }
  //     }
  //   },
  // }


  //翻译
  private config = {
    // 视频源信息
    "video_sources":"视频源信息",
    "stream_name":"视频源名城",
    "origin_url":"视频源地址",
    "stream_transform":"视频源类型",
    "eqpt_no":"eqpt_no",
    "current_project_name":"项目名",

    // 关注区域设置
    "crop_setting":"关注区域设置",
    "crop_mode":"剪裁模式",// 
    "manual_box":"剪裁范围",// 
    "crop_id_main":"crop_id_main",// 
    "crop_id_second":"crop_id_second",// 

    // 待机画面调整
    "stream_adjust":"待机画面调整",
    "standby":"standby",// TODO
    "no_signal_wait":"无信号超时",
    "check_model":"检查方式",
    "BaseCheck":"默认",
    "image_check":"通过对比图像",
    "encoder_check":"通过获取encoder",
    "standby_screen":"image_check 模式时配置",
    "api_addr":"encoder 模式时配置",
    "auth":"登陆信息",
    "user":"用户名",
    "pass":"密码",

    // 图像分析插件配置
    "consumer_plugin":"图像分析插件配置",
    "screen_abnormal":"视频异常配置项目",
    "detect_setting":"bha模型检测",
    "bha_dist_setting":"bha距离模型配置",
    "new_model_threshold":"新模型阈值",
    "hist_mode":"模型比较模式",
    "tmp_model_setting":"临时模型设置",
    "tmp_trans_per_thresh":"临时模型升级阈值",
    "timeout_delete_frame_cnt":"临时模型超时阈值",
    "dynamic_setting":"动态检测",
    "dynamic_thresh":"动态阈值",
    "report_setting":"检测变化后最小面积",
    "min_area":"异常上报配置",
    "measurement":"异常表格",
    "default":"default",
  }


  select_config = {
    stream_transform:['rtsp_direct','hls','rtmp','LocalFile'],
    check_model:['BaseCheck','image_check','encoder_check'],
    crop_mode:['None','manual'],
  }

  array_config = {
    onetype:['x_min', 'y_min', 'x_max', 'y_max']
  }

  two_json:any = {};
  three_json:any = {};
  four_json:any = {};
  five_json:any = {};
  six_json:any = {};


  @ViewChild('input')input:any;
  @ViewChild('a')a:any;
  @ViewChild('array')array:any;
  @ViewChild('select')select:any;

  _ = this;

  constructor(private dialogService:NbDialogService,private videoService:VideoServiceService) { }

  ngOnInit() {

    // this.init();
  }


   //保存
  send(){
    this.videoService.save(this._json).subscribe((f:any)=>{
      if(f.code == 1){

      }else{
        console.log('保存失败')
      }
    })
  }

  getData(){
    this.videoService.get().subscribe((f:any)=>{
      if(f.code == 1){
        this._json = f.data;
      }else{
        console.log('查询失败')
      }
    })
  }


  //点击
  configClick(item,level){
    console.log(item)
    switch(level){
      case '':
        this.two_json = this._json[item];
        this.three_json = {};
        this.four_json = {};
        this.five_json = {};
        this.six_json = {};
        break;
      case 'two':
        this.three_json = this.two_json[item];
        this.four_json = {};
        this.five_json = {};
        this.six_json = {};
        break;
      case 'three':
        this.four_json = this.three_json[item];
        this.five_json = {};
        this.six_json = {};
        break;
      case 'four':
        this.five_json = this.four_json[item];
        this.six_json = {};
        break;
      case 'five':
        this.six_json = this.five_json[item];
        break;
    }
    this.find(level);
  }

  find(level){
    // let arr = [this.two_json,this.three_json,this.four_json,this.five_json];
    let arr = ['two_json','three_json','four_json','five_json','six_json'];
    arr.forEach((f,i)=>{
      if(i == arr.length - 1)return;
      let arr_json = this[f] && Object.keys(this[f]);
      //不为 object 不为数组 不是当前点击的东西
      for(let j = 0;j < arr_json.length;j++){
        if(!!this.config[arr_json[j]] && typeof this[f][arr_json[j]] == 'object' 
          && !Array.isArray(this[f][arr_json[j]]) && f != `${level}_json`){
          this[arr[i+1]] = this[f][arr_json[j]];
          break;
        }
      }
    })
  }

  getTemp(key,item){
    let value = item[key];
    if(Array.isArray(value)){
      return this.array;
    }
    if(typeof value == 'string' || typeof value == 'number'){
      // 判断再当前key再select配置中是否存在
      if(this.select_config[key]){
        return this.select
      }
      return this.input;
    }
    return this.a
  }

  /**
   * 获取当前是否是被点击状态
   * @param key 
   * @param item_name 
   */
  getSelect(key,item_name){
    let now = this[`${item_name}_json`];
    let last = {};
    switch(item_name){
      case '':
        last = this.two_json;
        break;
      case 'two':
        last = this.three_json;
        break;
      case 'three':  
        last = this.four_json;
        break;
      case 'four':  
        last = this.five_json;
        break;
      case 'five':  
        last = this.six_json;
        break;
    }
    return now[key] == last?true:false;
  }

  /**
   * 下拉框选择值变化
   * @param item 
   */
  selectChange(e,item){
    console.log('下拉框值变化-->',item,e);
    item.json[item.key] = e;
    switch(item.key){
      case 'crop_mode': 
        if(e == 'None'){
          this._json.crop_setting.manual_box = {};
          this.three_json = this._json.crop_setting.manual_box;
        }else{
          if(Object.keys(item.json.manual_box).length == 0){
            this._json.crop_setting.manual_box = {
              'default':[0,0,0,0]
            }
            this.three_json = this._json.crop_setting.manual_box;
          }
        }
      break;
    }
  }

//------------------数组添加删除修改----------------------
  add(item){
    this.dialog_open('添加',
    JSON.stringify({key:'',value:[0,0,0,0]}),
    'add',VideoDialogComponent,item.json);

  }

  /**
   * 数组删除
   * @param item 
   */
  del(item){
    delete item.json[item.key];
    if(Object.keys(item.json).length == 0){
      this._json.crop_setting.crop_mode = 'None';
    }
  }

  /**
   * 编辑
   * @param item 
   */
  edit(item){
    console.log();
    this.dialog_open('编辑',
    JSON.stringify({key:item.key,value:item.json[item.key]}),
    'edit',VideoDialogComponent,item.json);
  }

   /**
   * 打开弹窗
   * @param title 标题
   * @param content json字符串
   * @param type 状态
   * @param component 弹窗组件
   */
    dialog_open(title,content,type,component,_json){
      this.dialogService
          .open(component, {
            closeOnBackdropClick: false,
            autoFocus: true,
            context: { title: title, content: content,type:type,_json:_json },
          })
          .onClose.subscribe((res) => {
            console.log(res)
            if(res.code == 1){
              // delete this.config[res.oldData.key];
              this.config[res.data.key] = res.data.key;

              switch(res.type){
                case 'add':
                  _json[res.data.key] = res.data.value;
                  break;
                case 'edit':
                  delete _json[ res.oldData.key];
                  _json[res.data.key] = res.data.value;
                  // _json = this.edit_json(res._json, res.oldData.key, res.data.key, res.data.value);
                  break;
              }

            }
          });
    }


  /**
   * 替换key 和 value
   * @param json 
   * @param oid 
   * @param 
   * @returns 
   */
  // edit_json(json,old,_new,value){
  //   let j:any = {};
  //   let arr = Object.keys(json);
  //   arr.forEach(f=>{
  //     if(f == old){
  //       j[_new] = value;
  //     }else{
  //       j[f] = json[f];
  //     }
  //   })
  //   return j
  // }


  /**
   * 画框
   */
  __canvas;
  init(){

    this.__canvas = new fabric.Canvas('c');
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';
  
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      // mouseUpHandler: deleteObject,
      render: renderIcon,
      cornerSize: 24
    });
  
    this.Add();
    this.Add();
  
    function deleteObject(eventData, transform) {
      var target = transform.target;
      var canvas = target.canvas;
          canvas.remove(target);
          canvas.requestRenderAll();
    }
  
    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      // ctx.drawImage(img, -size/2, -size/2, size, size);
      ctx.restore();
    }
  }

  Add() {
    var rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: 'transparent',
      width: 200,
      height: 100,
      objectCaching: true,
      stroke: 'red',
      strokeWidth: 2,
      lockSkewingY:false,
      id:'200',//区分多个框
    });

    this.__canvas.add(rect);
    this.__canvas.setActiveObject(rect);
  }

  

 
}
