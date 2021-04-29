import { fabric } from "fabric";

export const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

// row item  row_item_list:tabel的所有行的数据列表，row_item：table的单行的数据列表
var row_item_list = [],
  row_item = [];

var rects = [];

var planetLabel_list = []; // 矩形对应的title列表

var canvas = new fabric.Canvas("canvas");

export const Add = (item, _canvas) => {
  row_item = item;
  row_item_list.push(row_item);
  // item 0:名称、1:位置("100,100,200,200")、2:说明
  var top = Number(item[1].split(",")[0]),
    left = Number(item[1].split(",")[1]),
    width = Number(item[1].split(",")[2] - item[1].split(",")[0]),
    height = Number(item[1].split(",")[3] - item[1].split(",")[1]);
  // @ts-ignore
  var rect = new fabric.Rect({
    // top: 100,
    // left: 100,
    // width: 60,
    // height: 70,
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
  console.error("-----------row_item_list->", row_item_list);
  console.error("-----------rects->", rects);
  console.error("-----------_canvas,canvas->", _canvas, canvas);
  canvas = _canvas;
  console.error("-----------_canvas,canvas->", _canvas, canvas);

  rects.push(rect);
  //   rects.forEach((item) => {
  //     _canvas.add(item);
  //     if (item[item.length - 1]) {
  //       _canvas.setActiveObject(item);
  //     }
  //   });
  canvas.add(rect);
  // borderColor 要求激活
  canvas.setActiveObject(rect);

  // -----------------------------------------对应的 title
  // @ts-ignore
  var planetLabel = new fabric.Textbox("", {
    fill: "#fff",
    fontSize: 16,
    fontFamily: "Open Sans",
    textBackgroundColor: "#002244",
  });
  planetLabel_list.push(planetLabel);

  return canvas;
};
//   ======================= 鼠标进入图标
var hoverTarget;
canvas.on("mouse:over", function (options) {
  hoverTarget = options.target;
  // @ts-ignore
  var rect_list = rects;
  // var rect_list = canvas.getObjects();
  console.error("mouse:over rect_list", rect_list);
  console.error("-----------canvas.getObjects()->", canvas.getObjects());
  if (options.target && options.target.type === "rect") {
    var rect_index = rect_list.indexOf(options.target);
    var text_item = planetLabel_list[rect_index]; // rect 对应的 title

    // var polygonCenter = canvas.getActiveObject().getCenterPoint();
    var polygonCenter = options.target.getCenterPoint();
    // console.error("mouse:over", options.target, options.target.left);
    var translatedPoints = options.target.get("aCoords");
    // 得到 左上--右下点的坐标， tl、 br
    var tl = translatedPoints["tl"]; // 左上 {x: 100, y: 100}
    var br = translatedPoints["br"]; // 右下 {x: 100, y: 100}
    // console.error("mouse:over--tl,br", tl, br);
    var item = row_item_list[rect_index];

    text_item.set({
      left: tl.x + 10,
      top: tl.y - 20,
      text: item[0],
    });
    canvas.add(text_item);
  }
});
//   ======================= 鼠标离开图标
canvas.on("mouse:out", function (options) {
  // console.error("********planetLabel***********", planetLabel);
  var rect_list = rects;
  // var rect_list = canvas.getObjects();
  var rect_index = rect_list.indexOf(options.target);
  var text_item = planetLabel_list[rect_index];
  canvas.remove(text_item);
  canvas.requestRenderAll();
});

// @ts-ignore
export const renderIcon = (icon) => {
  return function (ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    // @ts-ignore
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
};

// @ts-ignore
export const deleteObject = (eventData, transform) => {
  console.error("删除----》", transform);
  var target = transform.target;
  var canvas = target.canvas;

  var rect_list = canvas.getObjects();
  var rect_index = rect_list.indexOf(target);
  var text_item = planetLabel_list[rect_index]; // rect 对应的 title
  console.error("rect_index>>>>>>", rect_index);
  // console.error("text_item", text_item);
  console.error("planetLabel_list, rect_list", planetLabel_list, rect_list);
  canvas.remove(text_item); // 删除提示
  canvas.remove(target);
  row_item_list.splice(rect_index, 1);
  // planetLabel_list.splice(rect_index, 1);
  console.error("planetLabel_list, rect_list", planetLabel_list, rect_list);
  canvas.requestRenderAll();
};

// 鼠标在图标上
