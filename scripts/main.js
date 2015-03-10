/*
 * # tutorial - tmlib.js
 * tmlib.js のチュートリアルです.
 * http://phi-jp.github.io/tmlib.js/tutorial.html
 */

var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var ASSETS = {
    "player": "http://jsrun.it/assets/s/A/3/j/sA3jL.png",
    "bg": "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
};

// main
tm.main(function() {
    // キャンバスアプリケーションを生成
    var app = tm.display.CanvasApp("#world");
    // リサイズ
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // ウィンドウにフィットさせる
    app.fitWindow();
    
    // ローダーで画像を読み込む
    var loading = tm.ui.LoadingScene({
        assets: ASSETS,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    });
    
    // 読み込み完了後に呼ばれるメソッドを登録
    loading.onload = function() {
        // メインシーンに入れ替える
        var scene = MainScene();
        app.replaceScene(scene);
    };
    // ローディングシーンに入れ替える
    app.replaceScene(loading);

    // 実行
    app.run();
});

// シーンを定義
tm.define("MainScene", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        this.player = Player().addChildTo(this);
        
        this.player.x = SCREEN_CENTER_X;
        this.player.y = SCREEN_HEIGHT;
        
        this.baseGroup = tm.display.CanvasElement().addChildTo(this);
        
        (5).times(function(i) {
            var b = Base().addChildTo(this.baseGroup);
            b.x = Math.rand(0, SCREEN_WIDTH);
            b.y = Math.rand(0, SCREEN_HEIGHT);
            
            if (i == 0) {
                b.x = SCREEN_CENTER_X;
                b.y = SCREEN_CENTER_Y+300;
            }
        }, this);
    },
    
    update: function(app) {
        if (this.player.target == null) {
            var bases = this.baseGroup.children;
            bases.some(function(base) {
                if (this.player.isHitElement(base)) {
                    this.player.setTarget(base);
                    return true;
                }
            }, this);
        }
        else if (app.pointing.getPointingStart()) {
            this.player.fly();
        }
    }
});


tm.define("Player", {
    superClass: "tm.display.CircleShape",
    
    init: function() {
        this.superInit({
            width: 32,
            height: 32,
            strokeStyle: "transparent",
        });
        
        this.direction = tm.geom.Vector2(0, -4);
        
        this.target = null;
    },
    
    update: function() {
        
        if (this.target) {
            var t = this.target;
            
            var angle = t.rotation + this.offsetAngle;
            var v = tm.geom.Vector2().setDegree(angle, t.radius + this.radius);

            this.position.x = t.x + v.x;
            this.position.y = t.y + v.y;
        }
        else {
            this.position.add(this.direction);
        }
    },
    
    setTarget: function(target) {
        var v = tm.geom.Vector2.sub(target.position, this.position);
        var angle = v.toAngle()*180/Math.PI;
        
        this.offsetAngle = angle+180 - target.rotation;
        
        this.target = target;
    },
    
    fly: function() {
        var v = tm.geom.Vector2.sub(this.position, this.target.position);
        this.direction = v.normalize().mul(4);;
        this.target = null;
    },
});


tm.define("Base", {
    superClass: "tm.display.StarShape",
    
    init: function() {
        this.superInit({
            width: 64,
            height: 64,
            sideIndent: 0.7,
            sides: 16,
            strokeStyle: "transparent",
            fillStyle: "white",
        });
    },
    
    update: function() {
        this.rotation += 4;
    }
});



