import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpserviceService } from "app/services/http/httpservice.service";
import { LocalDataSource } from "ng2-smart-table";
import { TableDelComponent } from "./temp/table-del/table-del.component";
import { TableEditComponent } from "./temp/table-edit/table-edit.component";
import { TableInputComponent } from "./temp/table-input/table-input.component";
import { fabric } from "fabric";
import { deleteObject, renderIcon, deleteIcon, Add } from "./temp/test-process";

const z_canvas = require("../../../assets/canvas/z_canvas.js");

/**
 * 试验配置与新增
 */
@Component({
  selector: "app-test-process",
  templateUrl: "./test-process.component.html",
  styleUrls: ["./test-process.component.scss"],
})
export class TestProcessComponent implements OnInit, AfterViewInit {
  public org_address = "";
  public org_type = "";
  public vjs_address = "";
  public current_project_name;

  test_info = {
    number: "", //任务单编号
    peopel: "", //试验人员
    project_name: "", //任务名称
    equipment: "", //试验设备
    laboratory: "实验室1", //实验室
    webcam: "", //摄像头
    check_model: "BaseCheck", //检测方式
    crop_mode: "None", //裁剪模式 默认None  manual
    crop_mode_arr: {},
    crop_mode_description: {}, // 裁剪方式说明
  };

  //任务单编号 可能存在的格式
  number_t = [
    /^LWT-NVH-(\d{5})/g,
    /^PGWT-DYN-(\d{5})/g,
    /^PGWT-VEH-(\d{5})/g,
    /^TOCWT-EMI-(\d{5})/g,
    /^LWT-NEE-(\d{5})/g,
    /^ESV&TTI-EMC-(\d{5})/g,
    /^LWT-PUM-(\d{5})/g,
    /^TOCWT-DEV-(\d{5})/g,
    /^LWT-CFT-(\d{5})/g,
    /^TOCWT-VAL-(\d{5})/g,
    /^ESV&TTI-ESDVC-(\d{5})/g,
    /^LWT-CAL-(\d{5})/g,
    /^LWT-MAT-(\d{5})/g,
    /^LWT-RLD-(\d{5})/g,
    /^LWT-SAF-(\d{5})/g,
    /^LWT-STR-(\d{5})/g,
    /^LWT-HVA-(\d{5})/g,
    /^PGWT-PER-(\d{5})/g,
    /^PGWT-DUR-(\d{5})/g,
  ];
  number_status = 0; //当前任务单号是否符合规则

  setting = {
    mode: "inline",
    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: true,
      perPage: 2,
    },
    columns: {
      no: {
        title: "名称",
        filter: false,
        width: "20%",
        type: "custom",
        renderComponent: TableInputComponent,
        onComponentInitFunction: (instance) => {
          instance.edit.subscribe((value) => {

            // TODO 进行图像画框
          });
        }
      },
      address: {
        title: "位置",
        filter: false,
        width: "20%",
        type: "custom",
        renderComponent: TableEditComponent,
        onComponentInitFunction: (instance) => {
          instance.edit.subscribe((value) => {
            // TODO 进行图像画框
          });
        },
      },
      description: {
        title: "说明",
        filter: false,
        width: "60%",
        type: "custom",
        renderComponent: TableDelComponent,
        onComponentInitFunction: (instance) => {
          instance.del.subscribe((row) => {
            this.source.remove(row);
          });
        },
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  webcamList = [];

  // 录像的宽高
  video = {
    h: 0,
    w: 0,
  };

  canvas = new fabric.Canvas("canvas");
  planetLabel_list = []; // 矩形对应的title列表
  // row item  row_item_list:tabel的所有行的数据列表，row_item：table的单行的数据列表
  row_item_list = [];
  row_item = [];
  rects = []; // canvas item

  _canvas;
  constructor(private http: HttpserviceService, private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    // this.getStream();
    this.canvas = new fabric.Canvas("canvas");
    var canvas = this.canvas;
    console.error(
      "************************************************************\n"
    );

    var that = this;

    // 鼠标 进入矩形
    var hoverTarget;
    that.canvas.on("mouse:over", function (options) {
      hoverTarget = options.target;
      // var rect_list = that.canvas.getObjects();
      var rect_list = that.rects;
      if (options.target && options.target.type === "rect") {
        var rect_index = rect_list.indexOf(options.target);
        var text_item = that.planetLabel_list[rect_index]; // rect 对应的 title

        // var polygonCenter = that.canvas.getActiveObject().getCenterPoint();
        var polygonCenter = options.target.getCenterPoint();
        // console.error("mouse:over", options.target, options.target.left);
        var translatedPoints = options.target.get("aCoords");
        // console.error("mouse:over", translatedPoints);
        // 得到 左上--右下点的坐标， tl、 br
        var tl = translatedPoints["tl"]; // 左上 {x: 100, y: 100}
        var br = translatedPoints["br"]; // 右下 {x: 100, y: 100}
        // console.error("mouse:over--tl,br", tl, br);
        var item = that.row_item_list[rect_index];
        // console.error("text_item, item", text_item, item, that.canvas);
        text_item.set({
          left: tl.x + 10,
          top: tl.y - 20,
          text: item[0],
        });
        canvas.add(text_item);
      }
    });

    // 鼠标 移出矩形
    that.canvas.on("mouse:out", function (options) {
      var rect_list = that.rects;
      var rect_index = rect_list.indexOf(options.target);
      var text_item = that.planetLabel_list[rect_index];
      that.canvas.remove(text_item);
      that.canvas.requestRenderAll();
    });

    // setTimeout(() => {
    //   this._canvas = new fabric.Canvas('canvas');
    //   // fabric.Object.prototype.transparentCorners = false;
    //   // fabric.Object.prototype.cornerColor = 'blue';
    //   // fabric.Object.prototype.cornerStyle = 'circle';
    //   this._canvas.setBackgroundImage(
    //     "",
    //     this._canvas.renderAll.bind( this._canvas),
    //     {
    //       // canvas 的位置是在画布哪里
    //       originX: "left",
    //       originY: "top",
    //       width:  this._canvas.width,
    //       height:  this._canvas.height,
    //     }
    //   );
    //   // 渲染图标
    //   var deleteImg = document.createElement("img");
    //   deleteImg.src = deleteIcon;
    //   // @ts-ignore  添加的 删除的icon
    //   fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    //     x: 0.5,
    //     y: -0.5,
    //     offsetY: 10,
    //     offsetX: 16,
    //     cursorStyle: "pointer",
    //     mouseUpHandler: deleteObject,
    //     render: renderIcon(deleteImg),
    //     cornerSize: 26,
    //   });
    //   Add(['1', "100,100,200,200", ""],this._canvas);
    // }, 10);
  }

  // 新增 名称-位置-说明后，同时新建canas的矩形
  after_add_fang_add_canas(data) {
    // {no: this.source.count(),address: [100, 100, 200, 200],description: "beizhu",}
    var data_ = [data.no, data.address.join(","), data.description];
    console.error("新建canas的矩形--------------->", data);
    setTimeout(() => {
      this.canvas.setBackgroundImage(
        "",
        this.canvas.renderAll.bind(this.canvas),
        {
          // canvas 的位置是在画布哪里
          originX: "left",
          originY: "top",
          width: this.canvas.width,
          height: this.canvas.height,
        }
      );

      // 渲染图标
      var deleteImg = document.createElement("img");
      deleteImg.src = deleteIcon;
      // @ts-ignore  添加的 删除的icon
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 10,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteImg),
        cornerSize: 26,
      });
      this.AddRect(data_);
    }, 10);
  }

  get_hls_address() {
    this.getVideoAddress();
  }

  save() {
    if (this.source.count() > 0) {
      this.test_info.crop_mode = "manual";
      new Array(this.source).forEach((el: any) => {
        el.data.forEach((f) => {
          this.test_info.crop_mode_arr[f.no] = f.address;
          this.test_info.crop_mode_description[f.no] = f.description;
        });
      });
    } else {
      this.test_info.crop_mode = "None";
      this.test_info.crop_mode_arr = {};
      this.test_info.crop_mode_description = {};
    }
    console.log(this.test_info);
    if (!this.isSave()) {
      alert("有必录项未填");
      return;
    }
    if (!this.keyup_number()) {
      alert("任务编号不符合规则");
      return;
    }
    this.http
      .get(
        `/api//mongo_api/video_process/stream/{ this.test_info.webcam}/project/{this.test_info.project_name}`,
        null
      )
      .subscribe((f: any) => {
        let str = `/api/mongo_api/video_process/stream/{this.test_info.webcam}/config`;
        let json = this.getparam();
        console.log(f);
        if (f._id) {
          this.jionParam(f, json);
          this.send(str, json);
        } else {
          this.send(str, json);
        }
      });
  }

  /**
   * 发送保存
   * @param str
   * @param json
   */
  send(str, json) {
    console.log(JSON.stringify(json));
    this.http.post(str, json).subscribe((f: any) => {
      if (f.success) {
        this.router.navigate([
          "/pages/video/real",
          {
            stream: this.test_info.webcam,
            taskname: this.test_info.project_name,
            taskstatus: "",
            errornum: "",
            _s: "real",
          },
        ]);
      } else {
        alert("保存失败！" + f.msg);
      }
    });
  }

  /**
   * 合成
   * @param f
   * @param json
   */
  jionParam(f, json) {
    json["stream_adjust"]["standby"]["no_signal_wait"] =
      f["stream_adjust"]["standby"]["no_signal_wait"];
    json["stream_adjust"]["standby"]["api_addr"] =
      f["stream_adjust"]["standby"]["api_addr"];
    json["stream_adjust"]["standby"]["auth"]["user"] =
      f["stream_adjust"]["standby"]["auth"]["user"];
    json["stream_adjust"]["standby"]["auth"]["pass"] =
      f["stream_adjust"]["standby"]["auth"]["pass"];
    json["consumer_plugin"]["save"] = json["consumer_plugin"]["save"];
    json["consumer_plugin"]["screen_abnormal"]["dynamic_setting"] =
      json["consumer_plugin"]["screen_abnormal"]["dynamic_setting"];
    json["consumer_plugin"]["screen_abnormal"]["min_area"] =
      json["consumer_plugin"]["screen_abnormal"]["min_area"];
  }

  isSave() {
    let _ = this.test_info;
    // number:"",//任务单编号
    // peopel:"",//试验人员
    // project_name:"",//任务名称
    // equipment:"",//试验设备
    // laboratory:"实验室1",//实验室
    // webcam:"",//摄像头
    // check_model:'BaseCheck',//检测方式
    // crop_mode:'None',//裁剪模式 默认None  manual
    // crop_mode_arr:{},
    // crop_mode_description:{},// 裁剪方式说明
    if (
      _.number &&
      _.peopel &&
      _.equipment &&
      _.laboratory &&
      _.webcam &&
      _.check_model
    ) {
      return true;
    }
    return false;
  }

  //切换摄像头
  changeWebcam(e) {
    console.log(e);
    this.test_info.webcam = e;
    this.getVideoAddress();
  }

  //获取摄像头
  getStream() {
    this.http
      .get("/api/mongo_api/video_process/stream", null)
      .subscribe((f: any) => {
        this.test_info.webcam = f && f.length > 0 ? f[0] : "";
        this.webcamList = f;
        this.getVideoAddress();
        this.getStreamWH();
      });
  }

  /**
   * 获取视频实际宽高
   */
  getStreamWH() {
    this.http
      .get(
        `/api/mongo_api/video_process/stream/${this.test_info.webcam}/detail`,
        null
      )
      .subscribe((f: any) => {
        console.log(f);
        this.video.h = f.height;
        this.video.w = f.width;
      });
  }

  getVideoAddress() {
    this.http
      .get("/api/mongo_api/video_process/stream/" + this.test_info.webcam, null)
      .subscribe((res) => {
        this.org_address = res["origin_url"];
        this.org_type = res["stream_transform"];
        this.current_project_name = res["current_project_name"];
        if (this.org_address) {
          if (this.org_type == "hls") {
            this.vjs_address = this.org_address;
          } else {
            this.http
              .post("/api/rtsp2hls", { rtsp_url: this.org_address }, null)
              .subscribe((res) => {
                // console.log("test: ", res);
                this.vjs_address = res["value"];
              });
          }
        }
      });
  }

  getwidth() {
    let vido = document.getElementsByClassName("row_vido");
    return vido[0].scrollWidth - 320;
  }

  getheight() {
    let vido = document.getElementsByClassName("row_vido");
    return vido[0].scrollHeight - 20;
  }

  keyup(e, value) {
    // console.log(e);
    // console.log(value.match(/[a-zA-Z0-9_]{1,}/g))
    //只允许输入英文数字下划线
    let arr = value.match(/[a-zA-Z0-9_]{1,}/g);
    this.test_info.project_name = arr ? arr.join("") : "";
  }

  keyup_number() {
    this.test_info.number = this.test_info.number.toUpperCase();

    for (let i = 0; this.number_t.length - 1 > i; i++) {
      if (this.test_info.number.match(this.number_t[i])) {
        this.test_info.number = this.test_info.number.match(
          this.number_t[i]
        )[0];
        this.number_status = 1;
        return true;
      }
    }
    return false;
  }

  /**
   * 添加裁剪的数据
   */
  add_fang() {
    var data = {
      no: String(this.source.count()),
      address: [100, 100, 200, 200],
      description: "beizhu",
    };
    this.source.prepend(data);
    console.log(this.source);
    // 新增 cannas 矩形
    this.after_add_fang_add_canas(data);
  }

  back() {
    this.router.navigate(["/pages/work-bench"]);
  }

  getarr = () => {
    let arr = [];
    new Array(this.source).forEach((f: any) => {
      arr.push(f.data);
    });
    return arr;
  };

  getparam() {
    return {
      project_name: this.test_info.project_name, // ※ 项目名, 与下面video_sources的current_project_name相同
      crop_setting: {
        // ※ 关注区域设置
        crop_mode: this.test_info.crop_mode, // ※ 剪裁模式,默认为None, manual时需要配置 manual_box
        manual_box: this.test_info.crop_mode_arr, // ※ 剪裁范围,manual_box为列表形式, 可以任意添加（有个参数可以设定上限）
        // ※ [用户自己定义的名字],四个int类型参数, 分别为 (x_min, y_min, x_max, y_max)

        // (x_min, y_min, x_max, y_max), img[y_min:y_max, x_min:x_max]
      },
      stream_adjust: {
        // ※ 待机画面调整
        standby: {
          no_signal_wait: 3, // ※ 无信号超时, 默认60
          /*
              ※ 检查方式：
                  BaseCheck: 默认, 无其它额外判定
                  image_check: 通过对比图像来判断是否开启, （暂不开放, 注释掉. ）
                  encoder_check: 通过获取encoder的参数判断是否开启
              */
          check_model: this.test_info.check_model,
          // ※ encoder_check 模式时配置
          api_addr: "http://10.7.94.203:2379", // ※ encoder http的配置
          auth: {
            // ※ encoder 登陆信息
            user: "admin",
            pass: "admin",
          },
        },
      },
      consumer_plugin: {
        // ※ 图像分析插件配置, 字典型, 暂时开发了两种子模块：save、screen_abnormal
        save: {
          // ※ 不进行具体配置, 只做enable、disable的判断. enable传递save键值的空{}, disable 时consumer_plugin中没save键值
        },
        screen_abnormal: {
          // ※ 视频异常配置项目
          detect_setting: {
            // ※ bha模型检测.
            // 动态检测, 判断前几帧与当前帧的帧间差值, 判断是否存在改变
            dynamic_setting: {
              // ※ 动态检测
              dynamic_thresh: 25, // ※ 动态阈值, 默认 25
              min_area: 15000, // ※ 检测变化后最小面积, 默认 15000
            },
            report_setting: {
              // ※ 异常上报配置
              measurement: this.test_info.webcam, // ※ 异常表格
            },
          },
        },
      },
      task: {
        number: this.test_info.number, //任务单编号
        peopel: this.test_info.peopel, //试验人员
        equipment: this.test_info.equipment, //试验设备
        laboratory: this.test_info.laboratory, //实验室
        webcam: this.test_info.webcam, //摄像头
        crop_mode_description: this.test_info.crop_mode_description,
      },
      // this.test_info
    };
  }
  // -------------------------------------
  AddRect(item) {
    this.row_item_list.push(item);
    // item 0:名称、1:位置("100,100,200,200")、2:说明
    var top = Number(item[1].split(",")[0]),
      left = Number(item[1].split(",")[1]),
      width = Number(item[1].split(",")[2] - item[1].split(",")[0]),
      height = Number(item[1].split(",")[3] - item[1].split(",")[1]);
    // @ts-ignore
    var rect = new fabric.Rect({
      top: top,
      left: left,
      width: width,
      height: height,
      fill: "",
      borderColor: "red",
      // objectCaching: false,
      stroke: "lightgreen",
      strokeWidth: 1,
      cornerSize: 6,
      cornerColor: "#ff0000",
      transparentCorners: false,
    });
    rect.lockRotation = true;
    rect.setControlVisible("mtr", false);
    console.error("-----------rect->", rect);

    this.rects.push(rect);
    this.canvas.add(rect);
    // borderColor 要求激活
    this.canvas.setActiveObject(rect);

    // -----------------------------------------对应的 title
    // @ts-ignore
    var planetLabel = new fabric.Textbox("", {
      fill: "#fff",
      fontSize: 16,
      fontFamily: "Open Sans",
      textBackgroundColor: "#002244",
    });
    this.planetLabel_list.push(planetLabel);

    // ------监听 鼠标移出矩形
  }

  // -------------------------------------
}
