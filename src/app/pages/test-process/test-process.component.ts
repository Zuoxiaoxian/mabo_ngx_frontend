import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { HttpserviceService } from "app/services/http/httpservice.service";
import { LocalDataSource } from "ng2-smart-table";
import { TableDelComponent } from "./temp/table-del/table-del.component";
import { TableEditComponent } from "./temp/table-edit/table-edit.component";
import { TableInputComponent } from "./temp/table-input/table-input.component";
import { fabric } from "fabric";
import { renderIcon, deleteIcon } from "./temp/test-process";
// import { deleteObject, renderIcon, deleteIcon, Add } from "./temp/test-process";

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

  type = "add"; //默认为添加 edit为修改

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
            this.edit_name_tochange_recttitle(value);
          });
        },
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
            // value = this.conversion(value);
            var address = this.anti_conversion(value.address);
            console.error("位置value,address>>>", value, address);
            // 修改位置，必须添加参数 'edit' 表示添加
            this.edit_position_tochange_rect(value, false, address, "edit");
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
            this.remove_row_to_deleteobject(row);
          });
        },
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  webcamList = [];

  // 录像的宽高
  video = {
    w: 1280,
    h: 780,
  };

  canvas = new fabric.Canvas("canvas");
  planetLabel_list = []; // 矩形对应的title列表
  // row item  row_item_list:tabel的所有行的数据列表，row_item：table的单行的数据列表
  row_item_list = [];
  row_item = [];
  rects = []; // canvas item

  _canvas;
  disabled = false;
  constructor(
    private http: HttpserviceService,
    private router: Router,
    private activate: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas("canvas");
    var canvas = this.canvas;
    var that = this;

    // 监听移动
    that.canvas.on("mouse:down", function (options) {
      if (options.target) {
        console.log("选中的", options.target);
        var target = options.target;
        var translatedPoints = target.get("aCoords");
        this.tl_br = [
          Math.round(translatedPoints["tl"]["x"]),
          Math.round(translatedPoints["tl"]["y"]),
          Math.round(translatedPoints["br"]["x"] - 1),
          Math.round(translatedPoints["br"]["y"] - 1),
        ];

        if (options.target.type === "rect") {
          // 监听缩放
          options.target.on("scaling", function (options) {
            // console.error("监听缩放===============>");
            // var width =
            //     Number(address_.split(",")[2]) - Number(address_.split(",")[0]),
            //   height =
            //     Number(address_.split(",")[3]) - Number(address_.split(",")[1]);
            // target.set({
            //   width: width,
            //   height: height,
            // });
            // target.setCoords();
          });

          options.target.on("moving", function (options) {
            var rect_list = that.rects;
            var rect_index = rect_list.indexOf(target);
            var text_item = that.planetLabel_list[rect_index]; // rect 对应的 title
            var translatedPoints = target.get("aCoords");
            // 得到 左上--右下点的坐标， tl、 br
            var tl = translatedPoints["tl"]; // 左上 {x: 100, y: 100}
            var br = translatedPoints["br"]; // 右下 {x: 100, y: 100}
            // console.error("mouse:over--tl,br", tl, br);
            var item = that.row_item_list[rect_index];
            text_item.set({
              left: tl.x + 10,
              top: tl.y - 20,
              // text: item[0],
            });
          });
        }
      }
    });
    // 监听鼠标 ‘松开’
    that.canvas.on("mouse:up", function (options) {
      var select_item = that.canvas.getActiveObject();
      var rect_list = that.rects;
      if (select_item) {
        var polygonCenter = select_item.getCenterPoint();
        // console.error("得到 中心点坐标polygonCenter>>>", polygonCenter);
        var translatedPoints = canvas.getActiveObject().get("aCoords");
        // console.error("监听鼠标 ‘松开’ 得到 顶点坐标>>>", translatedPoints);
        // 要得到对角线的坐标点， 左上---右下
        var tl_br = [
          Math.round(translatedPoints["tl"]["x"]),
          Math.round(translatedPoints["tl"]["y"]),
          Math.round(translatedPoints["br"]["x"]) - 1,
          Math.round(translatedPoints["br"]["y"]) - 1,
        ];

        console.error("***要得到对角线的坐标点， 左上---右下tl_br>>", tl_br);
        console.error(
          "***之前的要得到对角线的坐标点， 左上---右下tl_br>>",
          this.tl_br
        );

        var rect_index = rect_list.indexOf(select_item);
        var item = that.row_item_list[rect_index];
        if (item) {
          item[1] = tl_br.join(",");

          var row_2 = {
            no: item[0],
            address: item[1],
            description: item[2],
            rid: item[3],
          };
          row_2 = that.conversion(row_2);
          const [address, change] = that.out_of_bounds(row_2.address);
          // 改变 对应的矩形的宽高！=====================
          var b_w = tl_br[2] - tl_br[0]; // 当前的宽
          var b_h = tl_br[3] - tl_br[1]; // 当前的搞
          var before_address_ = this.tl_br.join(","); // 之前的

          var width = Math.round(
            Number(before_address_.split(",")[2]) -
              Number(before_address_.split(",")[0])
          );
          var height = Math.round(
            Number(before_address_.split(",")[3]) -
              Number(before_address_.split(",")[1])
          );
          // console.error("***改变 对应的矩形的宽高-b_w,b_h>>", b_w, b_h);
          // console.error("***之前的width,height>>", width, height);
          // console.error("***scale>>", select_item.getObjectScaling());
          var scaleX = select_item.getObjectScaling().scaleX,
            scaleY = select_item.getObjectScaling().scaleY;
          // console.error("***scaleX,scaleY==>>", scaleX, scaleY);
          if (Math.abs(width - b_w) > 2 || Math.abs(height - b_h) > 2) {
            select_item.set({
              scaleX: b_w / 100,
              scaleY: b_h / 100,
              // scaleX: b_w / width,
              // scaleY: b_h / height,
            });
            select_item.setCoords();
            that.canvas.renderAll();
          }
          // 改变 对应的矩形的宽高！=====================

          if (change) {
            var before_address = this.tl_br.join(",");
            // var before_address = tl_br.join(",");
            row_2.address = address;

            that.edit_position_tochange_rect(row_2, change, before_address);
          }
          // console.error("rect_index , item>>", rect_index, item);
          // this.source.update()
          var rows = []; // 删除时候的 table数据
          that.row_item_list.forEach((item) => {
            var row = {
              no: item[0],
              address: item[1],
              description: item[2],
              rid: item[3],
            };
            // 800*450---->1280*780
            console.error("************row*********", row);
            row = that.conversion(row);
            rows.push(row);
          });
          console.error("************8rows*********", rows);

          that.source.load(rows);
          // 更新title

          // that.canvas.renderAll();
        } else {
          // var item = that.row_item_list[rect_index];
          console.error(
            "更新tabel| rect_index,>>>>",
            rect_index,
            that.row_item_list
          );
        }
      }
    });

    this.activate.params.subscribe((data) => {
      if (data.stream_name) {
        this.type = "edit";
        setTimeout(() => {
          this.disabled = true;
        }, 20);
        this.http
          .get(
            `api/mongo_api/video_process/stream/${data.stream_name}/project/${data.project_name}`,
            null
          )
          .subscribe((f: any) => {
            let arr = [];
            this.test_info.project_name = data.project_name;
            this.test_info.webcam = f.task?.webcam;
            this.getStream();
            this.test_info.number = f.task?.number;
            this.test_info.peopel = f.task?.peopel;
            this.test_info.equipment = f.task?.equipment;
            this.test_info.laboratory = f.task?.laboratory;
            this.test_info.check_model = f.stream_adjust.standby.check_model;
            console.log(JSON.stringify(f));
            this.test_info.project_name = f.project_name;
            this.http
              .get(
                `/api/mongo_api/video_process/stream/${this.test_info.webcam}/detail`,
                null
              )
              .subscribe((c: any) => {
                this.video.h = c.height;
                this.video.w = c.width;
                let i = 0;
                for (let key in f.crop_setting.manual_box) {
                  let g = {
                    no: key,
                    address: this.anti_conversion(
                      f.crop_setting.manual_box[key]
                    ).split(","),
                    description: f.task.crop_mode_description
                      ? f.task.crop_mode_description[key]
                      : "",
                    rid: i,
                  };
                  console.log(g);
                  arr.push(g);
                  i++;
                  this.add_fang(g);
                }
              });

            //           address: (4) [100, 100, 200, 200]
            // description: "beizhu"
            // no: "0"
            // rid: 0
            console.log(arr);
          });
      } else {
        // this.getStream();
      }
      // /mongo_api/video_process/stream/string:stream_name/project/string:project_name
    });
  }

  // 新增 名称-位置-说明后，同时新建canas的矩形
  after_add_fang_add_canas(data) {
    // {no: this.source.count(),address: [100, 100, 200, 200],description: "beizhu",}
    var data_ = [data.no, data.address.join(","), data.description, data.rid];
    // console.error("新建canas的矩形--------------->", data);
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
      var that = this;
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 10,
        offsetX: 16,
        cursorStyle: "pointer",
        // mouseUpHandler: this.deleteObject,
        mouseUpHandler: this.deleteObject(that),
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
      // let video = document.getElementsByTagName("video");
      // console.log(video);
      // let w = 800;
      // let h = 450;
      // if (video && video.length > 0) {
      //   w = document.getElementsByTagName("video")[0].scrollWidth;
      //   h = document.getElementsByTagName("video")[0].scrollHeight;
      // }
      // new Array(this.source).forEach((el: any) => {
      //   el.data.forEach((f) => {
      //     console.log(f.no, f.address);
      //     let address = [0, 0, 0, 0];
      //     if (Array.isArray(f.address)) {
      //       f.address.forEach((el, i) => {
      //         address[i] = parseFloat(el);
      //       });
      //     } else {
      //       let arr = f.address.toString().split(",");
      //       address = arr.map((m) => parseInt(m));
      //       // address.forEach((g, i) => {
      //       // if (arr && arr[i]) {
      //       // g = parseFloat(arr[i]);
      //       // }
      //       // });
      //     }
      //     this.test_info.crop_mode_arr[f.no] = [
      //       ((address[0] || 0) / w) * this.video.w,
      //       ((address[1] || 0) / h) * this.video.h,
      //       ((address[2] || 0) / w) * this.video.w,
      //       ((address[3] || 0) / h) * this.video.h,
      //     ];
      //     this.test_info.crop_mode_arr[f.no] = this.test_info.crop_mode_arr[
      //       f.no
      //     ].map((m) => parseInt(m));
      //     console.log(this.test_info.crop_mode_arr[f.no]);
      //     this.test_info.crop_mode_description[f.no] = f.description;
      //   });
      // });
      new Array(this.source).forEach((el: any) => {
        el.data.forEach((f) => {
          if (typeof f.address === "string") {
            f.address = f.address.toString().split(",");
          }
          this.test_info.crop_mode_arr[f.no] = f.address.map((m) =>
            parseInt(m)
          );
          this.test_info.crop_mode_description[f.no] = f.description;
        });
      });
    } else {
      this.test_info.crop_mode = "None";
      this.test_info.crop_mode_arr = {};
      this.test_info.crop_mode_description = {};
    }
    console.log(this.test_info);
    // return;
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
        `/api//mongo_api/video_process/stream/${this.test_info.webcam}/project/${this.test_info.project_name}`,
        null
      )
      .subscribe((f: any) => {
        let str = `/api/mongo_api/video_process/stream/${this.test_info.webcam}/config`;
        if (this.type == "edit") {
          str = `/api/mongo_api/video_process/stream/${this.test_info.webcam}/change`;
        }
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
        let navigationExtras: NavigationExtras = {
          queryParams: {
            stream: this.test_info.webcam,
            taskname: this.test_info.project_name,
            // taskstatus: "",
            // errornum: "",
            _s: "real",
          },
          fragment: "anchor",
        };
        this.router.navigate(
          [
            "/pages/video/real",

            // camera_test&taskname=123_test&taskstatus=-&errornum=-&_s=real
          ],
          navigationExtras
        );
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
    this.vjs_address = "";
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
  add_fang(f?) {
    // if(!this.video.h || !this.video.w){
    //   alert('未获得摄像头实际宽高，无法使用画框功能');
    //   return;
    // }
    var no = this.source.count();
    var data = {
      no: String(no),
      address: [100, 100, 200, 200],
      description: "beizhu",
      rid: no,
    };
    if (f) {
      data = f;
    }
    this.source.prepend(this.conversion(data));
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

  /**
   * 将 得到的坐标转换为 实际宽高的坐标
   * @param data 800*450---->1280*780
   */
  conversion(data) {
    let w = 800;
    let h = 450;
    let video = document.getElementsByTagName("video");
    if (video && video.length > 0) {
      w = document.getElementsByTagName("video")[0].scrollWidth;
      h = document.getElementsByTagName("video")[0].scrollHeight;
    }
    let d = JSON.parse(JSON.stringify(data));
    if (typeof d.address === "string") {
      d.address = d.address.split(",").map((m) => parseInt(m));
      d.address = [
        ((d.address[0] || 0) / w) * this.video.w,
        ((d.address[1] || 0) / h) * this.video.h,
        ((d.address[2] || 0) / w) * this.video.w,
        ((d.address[3] || 0) / h) * this.video.h,
      ]
        .map((m) => parseInt(m.toString()))
        .join(",");
    } else if (Array.isArray(d.address)) {
      d.address = [
        ((d.address[0] || 0) / w) * this.video.w,
        ((d.address[1] || 0) / h) * this.video.h,
        ((d.address[2] || 0) / w) * this.video.w,
        ((d.address[3] || 0) / h) * this.video.h,
      ].map((m) => parseInt(m.toString()));
    }
    return d;
  }
  // 1280*780----> 800*450
  anti_conversion(address) {
    let w = 800;
    let h = 450;
    let video = document.getElementsByTagName("video");
    if (video && video.length > 0) {
      w = document.getElementsByTagName("video")[0].scrollWidth;
      h = document.getElementsByTagName("video")[0].scrollHeight;
    }
    if (typeof address === "string") {
      let d: any = address.split(",");
      address = [
        (w / this.video.w) * d[0],
        (h / this.video.h) * d[1],
        (w / this.video.w) * d[2],
        (h / this.video.h) * d[3],
      ]
        .map((m) => parseInt(m.toString()))
        .join(",");
    } else if (Array.isArray(address)) {
      address = [
        (w / this.video.w) * address[0],
        (h / this.video.h) * address[1],
        (w / this.video.w) * address[2],
        (h / this.video.h) * address[3],
      ]
        .map((m) => parseInt(m.toString()))
        .join(",");
    }
    return address;
  }
  // -------------------------------------
  /**
   * 画框的坐标越界判断
   * @param address
   */
  out_of_bounds(address) {
    // return [address, true];
    let ads = [];
    // let w = document.getElementsByTagName("video")[0].scrollWidth;
    // let h = document.getElementsByTagName("video")[0].scrollHeight;
    let w = this.video.w;
    let h = this.video.h;
    if (typeof address === "string") {
      // ads = address.split(",");
      ads = address.split(",").map(function (a) {
        return Number(a);
      });
      // console.error("画框的坐标越界判断>>", ads);
      // console.error("画框的坐标越界判断,w,h>>", w, h);

      let change = false; //是否需要重新修改位置

      if (ads[0] < 0) {
        ads[2] = Number(ads[2] - parseInt(ads[0]));
        ads[0] = 0;
        change = true;
      }
      if (ads[1] < 0) {
        ads[3] = Number(ads[3] - parseInt(ads[1]));
        ads[1] = 0;
        change = true;
      }
      if (ads[2] < 0) {
      }
      if (ads[3] < 0) {
      }

      if (ads[0] > w) {
      }
      if (ads[2] > w) {
        // w,h 800 450
        ads[0] = Number(ads[0] - parseInt(ads[2]) + w);
        ads[2] = w;
        change = true;
      }

      if (ads[1] > h) {
      }
      if (ads[3] > h) {
        // w,h 800 450
        ads[1] = Number(ads[1] - parseInt(ads[3]) + h);
        ads[3] = h;
        change = true;
      }

      console.log(ads);
      return [ads.join(","), change];
      //
    }
  }
  // -------------------------------------

  // 编辑位置时---改变矩形位置
  edit_position_tochange_rect(data, change?, before_address?, edit?) {
    var no = data["no"],
      rid = data["rid"],
      address = this.anti_conversion(data["address"]),
      rect_list = this.rects,
      planetLabel_list = this.planetLabel_list,
      rect_index = null,
      row_item_list = this.row_item_list;
    row_item_list.forEach((row, index) => {
      if (row[row.length - 1] === rid) {
        row[1] = address;
        rect_index = index;
      }
    });
    // -------矩形移动
    var rect_list_item = rect_list[rect_index];
    // console.error("data-------------", data);
    // console.error("address，change-------------", address, change); // 0,30,101,131
    // console.error("before_address,edit-------------", before_address, edit);

    var translatedPoints = rect_list_item["aCoords"];
    var tl_br = [
      Math.round(translatedPoints["tl"]["x"]),
      Math.round(translatedPoints["tl"]["y"]),
      Math.round(translatedPoints["br"]["x"]) - 1,
      Math.round(translatedPoints["br"]["y"]) - 1,
    ];

    console.error("=====tl_br=======>>>", tl_br);

    // // 动画----
    rect_list_item.animate("left", Number(address.split(",")[0]), {
      duration: 1000,
      onChange: this.canvas.renderAll.bind(this.canvas),
    });
    rect_list_item.animate("top", Number(address.split(",")[1]), {
      duration: 1000,
      onChange: this.canvas.renderAll.bind(this.canvas),
    });

    var width, height, b_w, b_h;
    width = tl_br[2] - tl_br[0];
    height = tl_br[3] - tl_br[1];
    var before_address_list = before_address.split(",");

    b_w = Number(before_address_list[2]) - Number(before_address_list[0]);
    b_h = Number(before_address_list[3]) - Number(before_address_list[1]);
    if (edit === "edit") {
      // console.error("width,height---------->>>", width, height);
      // console.error("b_w,b_h---------->>>", b_w, b_h);
      if (Math.abs(width - b_w) > 2 || Math.abs(height - b_h) > 2) {
        console.error("***************************************************");
        var scaleX = rect_list_item.getObjectScaling().scaleX,
          scaleY = rect_list_item.getObjectScaling().scaleY;
        console.error("***scaleX,scaleY==>>", scaleX, scaleY);
        rect_list_item.set({
          scaleX: b_w / 100,
          scaleY: b_w / 100,
        });

        rect_list_item.setCoords();
        this.canvas.renderAll();
      } else {
        console.error("|||||||||else|||||||||||b_w,b_h---------->>>", b_w, b_h);
      }
    }

    // ---------矩形对应的title移动
    var planetLabel_list_item = planetLabel_list[rect_index];
    if (typeof address === "string") {
      planetLabel_list_item.animate(
        "left",
        Number(address.split(",")[0]) + 10,
        {
          duration: 1000,
          onChange: this.canvas.renderAll.bind(this.canvas),
        }
      );
      planetLabel_list_item.animate(
        "top",
        Number(address.split(",")[1]) - 20 < 0
          ? 0
          : Number(address.split(",")[1]) - 20,
        {
          duration: 1000,
          onChange: this.canvas.renderAll.bind(this.canvas),
        }
      );
    } else {
      planetLabel_list_item.animate("left", Number(address.address[0]) + 10, {
        duration: 1000,
        onChange: this.canvas.renderAll.bind(this.canvas),
      });
      planetLabel_list_item.animate(
        "top",
        Number(address.address[1]) - 20 < 0
          ? 0
          : Number(address.address[1]) - 20,
        {
          duration: 1000,
          onChange: this.canvas.renderAll.bind(this.canvas),
        }
      );
    }

    // this.canvas.requestRenderAll();

    // 要得到对角线的坐标点， 左上---右下
    if (typeof address === "string") {
      var tl_br = [
        Number(address.split(",")[0]),
        Number(address.split(",")[1]),
        Number(address.split(",")[2]),
        Number(address.split(",")[3]),
      ];
      console.error("要得到对角线的坐标点， 左上---右下>>", tl_br);
    } else {
      var tl_br = [
        Number(address.address[0]),
        Number(address.address[1]),
        Number(address.address[2]),
        Number(address.address[3]),
      ];
      console.error("要得到对角线的坐标点， 左上---右下>>", tl_br);
    }
  }

  // 编辑名称时---改变矩形title
  edit_name_tochange_recttitle(data) {
    console.error("编辑位置时---改变矩形位置>>>", data);
    var no = data["no"],
      rid = data["rid"],
      address = data["address"],
      rect_list = this.rects,
      planetLabel_list = this.planetLabel_list,
      rect_index = null,
      row_item_list = this.row_item_list;
    row_item_list.forEach((row, index) => {
      if (row[row.length - 1] === rid) {
        row[0] = no;
        rect_index = index;
      }
    });
    var planetLabel_list_item = planetLabel_list[rect_index];

    // 更新title
    planetLabel_list_item.set({
      text: no,
    });
    this.canvas.renderAll();
  }

  // 删除table中的行时，删除矩形和矩形对应的title
  remove_row_to_deleteobject(data) {
    console.error("删除table中的行时，删除矩形和矩形对应的title", data);
    var no = data["no"],
      rid = data["rid"],
      address = data["address"],
      rect_list = this.rects,
      planetLabel_list = this.planetLabel_list,
      rect_index = null,
      row_item_list = this.row_item_list;
    row_item_list.forEach((row, index) => {
      if (row[row.length - 1] === rid) {
        rect_index = index;
      }
    });

    var target = rect_list[rect_index];
    var text_item = planetLabel_list[rect_index]; // rect 对应的 title
    this.canvas.remove(text_item); // 删除提示
    this.canvas.remove(target); // 删除矩形

    row_item_list.splice(rect_index, 1);
    planetLabel_list.splice(rect_index, 1);
    rect_list.splice(rect_index, 1);
    // console.error(
    //   "删除 row_item_list",
    //   row_item_list,
    //   planetLabel_list,
    //   rect_list
    // );

    this.canvas.requestRenderAll();
  }

  deleteObject(that) {
    var source = this.source;
    return function deleteObject(eventData, transform) {
      var target = transform.target;
      var canvas = target.canvas;

      var rect_list = that.rects;
      var rect_index = rect_list.indexOf(target);
      var text_item = that.planetLabel_list[rect_index]; // rect 对应的 title

      var r_list = canvas.getObjects();

      // console.error("r_list>>>>>>", r_list);
      // console.error("text_item", text_item);
      // console.error("target", target);

      console.error(
        "planetLabel_list, rect_list",
        that.planetLabel_list,
        rect_list
      );

      r_list.forEach((element, index) => {
        if (element == text_item) {
          canvas.remove(element); // 删除提示
        }
      });

      console.error(
        "删除的table的row数据：>>>>>>",
        that.row_item_list[rect_index]
      );

      canvas.remove(target);
      that.row_item_list.splice(rect_index, 1);
      that.planetLabel_list.splice(rect_index, 1);
      rect_list.splice(rect_index, 1);
      console.error(
        "planetLabel_list, rect_list",
        that.planetLabel_list,
        rect_list
      );

      var rows = []; // 删除时候的 table数据
      that.row_item_list.forEach((item) => {
        var row = {
          no: item[0],
          address: item[1],
          description: item[2],
          rid: item[3],
        };
        rows.push(row);
      });
      console.error("删除tabel>>>>", rows);
      source.load(rows);

      // 点击图标删除矩形时，同时删除table
      canvas.requestRenderAll();
    };
  }

  // 新增 矩形
  AddRect(item) {
    this.row_item_list.push(item);
    // item 0:名称、1:位置("100,100,200,200")、2:说明
    var top = Number(item[1].split(",")[1]),
      left = Number(item[1].split(",")[0]),
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
    // console.error("-----------rect->", rect);

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

    planetLabel.set({
      left: Number(item[1].split(",")[1]) + 10,
      top: Number(item[1].split(",")[0]) - 20,
      text: item[0],
    });
    this.planetLabel_list.push(planetLabel);

    this.canvas.add(planetLabel);

    // ------监听 鼠标移出矩形
  }
  // 更新 矩形
  updaterect(position, index) {}

  // -------------------------------------
}
