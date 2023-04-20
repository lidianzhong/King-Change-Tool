"ui";

var pos = [1620,935];

//坐标的位置
var shop = [150,450];
var buy = [280,420];

ui.layout(
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="王者辅助工具" />
        </appbar>
        <card w="*" h="70" margin="10 5" cardCornerRadius="2dp"
            cardElevation="1dp" gravity="center_vertical">
            <horizontal padding="18 8" h="auto">
                <text id="text01" text="确保无障碍服务已开启：" textColor="#222222" marginTop="8" textSize="16sp"/>
                <Switch id="autoService" checked="{{auto.service != null}}" margin="7" />
            </horizontal>
            <View id="card1_color" bg="#ff5722" h="*" w="10"/>
        </card>

        <card w="*" h="70" margin="10 5" cardCornerRadius="2dp"
            cardElevation="1dp" gravity="center_vertical">
            <vertical padding="18 8" h="auto">
                <text text="点击悬浮按钮换装，点击音量上键关闭服务" textColor="#222222" marginTop="4" textSize="16sp"/>
                <text text="需确保悬浮穿权限打开" textColor="#999999" textSize="14sp"/>
            </vertical>
            <View id="card2_color" bg="#ff5722" h="*" w="10"/>
        </card>

        <card w="*" h="400" margin="10 5" cardCornerRadius="2dp"
            cardElevation="1dp" gravity="center_vertical">
            <vertical>
                <text id="text01" text="请选择装备格：" textColor="#222222" margin="20" textSize="20sp"/>

                <radiogroup checkedButton="@+id/radio6" >
                <radio id="radio1" text="第一格装备栏" margin="20 10" textSize="16sp"/>
                <radio id="radio2" text="第二格装备栏" margin="20 10" textSize="16sp"/>
                <radio id="radio3" text="第三格装备栏" margin="20 10" textSize="16sp"/>
                <radio id="radio4" text="第四格装备栏" margin="20 10" textSize="16sp"/>
                <radio id="radio5" text="第五格装备栏" margin="20 10" textSize="16sp"/>
                <radio id="radio6" text="第六格装备栏" margin="20 10" textSize="16sp"/>
                </radiogroup>

            </vertical>


            <View id="card3_color" bg="#ff5722" h="*" w="10"/>
        </card>

        <card w="*" h="70" margin="10 5" cardCornerRadius="2dp"
            cardElevation="1dp" gravity="center_vertical">
            <vertical padding="18 8" h="auto">
                <text autoLink="web" textColor="#999999" text="Github: github.com/lidianzhong/King-Change-Tool"/>
                <text text="©云欲雨 2023    软件仅供学习使用" textColor="#999999" textSize="14sp" marginTop="6"/>
            </vertical>
            <View id="card4_color" bg="#ff5722" h="*" w="10"/>
        </card>



    </vertical>
);

ui.radio1.on("check", (checked) => {
    if (checked) {
        pos = [846,950];
        toastLog("选择第一格");
    } 
});

ui.radio2.on("check", (checked) => {
    if (checked) {
        pos = [1010,950];
        toastLog("选择第二格");
    } 
});

ui.radio3.on("check", (checked) => {
    if (checked) {
        pos = [1162,950];
        toastLog("选择第三格");
    } 
});

ui.radio4.on("check", (checked) => {
    if (checked) {
        pos = [1324,950];
        toastLog("选择第四格");
    } 
});

ui.radio5.on("check", (checked) => {
    if (checked) {
        pos = [1466,950];
        toastLog("选择第五格");
    } 
});

ui.radio6.on("check", (checked) => {
    if (checked) {
        pos = [1618,950];
        toastLog("选择第六格");
    } 
});

ui.autoService.on("check", function(checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if(checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if(!checked && auto.service != null){
        auto.service.disableSelf();

        ui.card1_color.attr("bg", "#ff5722")
        ui.card2_color.attr("bg", "#ff5722")
        ui.card3_color.attr("bg", "#ff5722")
        ui.card4_color.attr("bg", "#ff5722")

    }

});

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function() {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    if(auto.service != null) {
        ui.card1_color.attr("bg", "#00FF00")
        ui.card2_color.attr("bg", "#00FF00")
        ui.card3_color.attr("bg", "#00FF00")
        ui.card4_color.attr("bg", "#00FF00")
    }
    ui.autoService.checked = auto.service != null;
});

threads.start(function(){  

    setInterval(()=>{}, 10000);//需设置一个定时器保持脚本不会停止运行，悬浮窗才不会被关闭
      initFloatWin()//加载悬浮窗
 
 } )


function initFloatWin() {
    var window = floaty.window(
      <frame>
          <button id="action" text="换装" w="50" h="50" bg="#77ffffff" />
      </frame>
  );
  var execution = null;
  //记录按键被按下时的触摸坐标
  var x = 0, y = 0;
  //记录按键被按下时的悬浮窗位置
  var windowX, windowY;
  //记录按键被按下的时间以便判断长按等动作
  var downTime;
  window.action.setOnTouchListener(function(view, event){
    switch(event.getAction()){
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            //如果按下的时间超过1.5秒判断为长按，退出脚本
            if(new Date().getTime() - downTime > 1500){
                exit();
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if(Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5){
                onClick();
            }
            return true;
    }
    return true;
  });
  }
  
  function onClick(){
    threads.start(function(){
        task();
    });
  }

//申请屏幕分辨率，这个不需要改，下面的坐标会自动以此为标准到你的分辨率
// setScreenMetrics(1080,2400);

  //***************换装操作*************** */
function task() {
    rclick(shop[0],shop[1],0);//停止移动，因为会中断操作
    rclick(shop[0],shop[1],20);//打开商店
    rclick(pos[0],pos[1],20);//选择第六件，可以自己修改，变成第一件或者第二件的位置
    rclick(1980,860,20);//出售
    rclick(2000,95,20);//关闭
    rclick(310,436,20);//购买
    // rclick(buy[0],buy[1],0);//购买，点保证买到
};

let rx = 1080; //开发设备x值
let ry = 2400; //开发设备的y值
 
//换算公式 点击坐标除以 点击坐标X Y | 除以开发设备X Y |乘以实际设备X Y ==换算后的坐标

console.log(device.width);
console.log(device.height);


//随机位置和时间
function rclick(x,y,r) {
    if (r != 0) sleep(r+random(0,5));

    var tx = x / rx * device.width;
    var ty = y / ry * device.height;

    // console.log("x = ", x, " y = ", y, " tx = ", tx, " ty = ", ty);

    //press(x坐标，y坐标，时间);时间不能太长，太长会变成长按而不是点击
    press(tx + random(-10,10),ty + random(-10,10),50+random(0,10));
}

if(auto.service != null) {
    ui.card1_color.attr("bg", "#00FF00")
    ui.card2_color.attr("bg", "#00FF00")
    ui.card3_color.attr("bg", "#00FF00")
    ui.card4_color.attr("bg", "#00FF00")
}