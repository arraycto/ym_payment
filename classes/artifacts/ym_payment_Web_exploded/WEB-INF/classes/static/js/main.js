
function get(that,url,params,successCallback,errorCallback){
    that.$http.get(url,{
        params:params,
        headers: {
            'userId': sessionStorage.userId,
            'token': sessionStorage.token,
            'sign': sessionStorage.sign,
            'token-upu': 'upu20.com'
        }
    }).then(
        function(response){
            console.log('success:', response.body);
            successCallback(response.body);
        }
        ,function(){
            console.log("error:");
            errorCallback();

        }
    );
}


function post(that,url,params,successCallback,errorCallback){
    that.$http.post(url,
        params,
        {
            headers: {
                'userId': sessionStorage.userId,
                'token': sessionStorage.token,
                'sign': sessionStorage.sign,
                'token-upu': 'upu20.com'
            },
            emulateJSON: true
        }
    ).then(
        function(response){
            console.log('success:', response.body);
            successCallback(response.body);
        }
        ,function(){
            console.log("error:");
            errorCallback();

        }
    );
}

/**
 * 获取URL参数
 * @param name 参数名称
 * @returns
 */
function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
}

/**
 * 去除重复数组
 */
function repeat(array) {
    var r = [];
    for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (array[i] === array[j])
                j = ++i;
        r.push(array[i]);
    }
    return r;
}

/**
 * 数组是否含有指定元素
 */
Array.prototype.contains = function(item){
    return RegExp("\\b"+item+"\\b").test(this);
};

/**
 * 删除数组内指定值元素
 * array 数组
 * val值
 */
function arrayRemove(array, val) {
    var index = -1;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
            index = i;
        }
    }
    if (index > -1) {
        array.splice(index, 1);
    }
}

/**
 * 比较两个数组是否相等
 */
function compare(a1, a2) {
    var exists = false;
    if (a1 instanceof Array && a2 instanceof Array) {
        for (var i = 0, iLen = a1.length; i < iLen; i++) {
            for (var j = 0, jLen = a2.length; j < jLen; j++) {
                if (a1[i] === a2[j]) {
                    return true;
                }
            }
        }
    }
    return exists;
}

/**
 * 判断字符串是数值
 */
function isNumeric(n) {
    var s = String(n)
    if (!/^[0-9.eE+-]+$/.test(s)) return false;
    var v = Number(s)
    return Number.isFinite(v)
}


/**
 * 生成字母头像
 */
function letterAvatar(name, size, color) {
    name  = name || '';
    size  = size || 60;
    var colours = [
            "#eccc68", "#ff7f50", "#ff6b81", "#ffa502", "#747d8c", "#ff4757", "#7bed9f", "#70a1ff", "#8e44ad", "#2ed573",
            "#1e90ff", "#a4b0be", "#ff6348", "#ff9ff3", "#f368e0", "#48dbfb", "#badc58", "#6ab04c", "#0fbcf9", "#f9ca24"
        ],
        nameSplit = String(name).split(' '),
        initials, charIndex, colourIndex, canvas, context, dataURI;
    if (nameSplit.length == 1) {
        initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
    } else {
        initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }
    if (window.devicePixelRatio) {
        size = (size * window.devicePixelRatio);
    }
    charIndex     = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex   = charIndex % 20;
    canvas        = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    context       = canvas.getContext("2d");

    //偏移
    var offset = 0;
    if(/^[\u4E00-\u9FA5]+$/.test(initials)){ //如果是中文
        offset = 1;
    }
    context.fillStyle = color ? color : colours[colourIndex - 1];
    context.fillRect (0, 0, canvas.width, canvas.height);
    context.font = Math.round(canvas.width/2)+"px Arial";
    context.textAlign = "center";
    context.fillStyle = "#FFF";
    context.fillText(initials, (size / 2)+offset, (size / 1.5)+offset);
    dataURI = canvas.toDataURL();
    canvas  = null;
    return dataURI;
}


/**####################################################################################*/

/**创建全局状态存储对象*/
var store = new Vuex.Store({
    //存储状态值
    state : {
        token : '',           //令牌标记
        cacheComponents: [],  //keepAlive缓存组件
    },

    // 状态值的改变方法,操作状态值,mutations方法必须是同步方法
    // 提交mutations是更改Vuex状态的唯一方法
    mutations : {

        //设置令牌标记
        setToken : function setToken(state, token) {
            state.token = token;
        },

        //设置缓存组件
        setCacheComponents : function setCacheComponents(state, data) {
            state.cacheComponents = data;
        },
    },
    getters : {
        cacheComponents: function (state) {
            return state.cacheComponents;
        }
    },
    //异步操作方法
    actions : {}
});

//收银台组件
var pay_component = Vue.extend({
    name: 'pay',
    template : '#pay-template',

    data : function data() {
        return {
            userId:'',
            userName:'',
            subject:'',
            appId:'',
            totalAmount:5,
            options:[],
        };
    },

    created : function created() {
        this.initialization();
        //缓存组件
        this.$store.commit('setCacheComponents',  ['pay']);
    },

    beforeRouteLeave: function (to, from, next) {
        //清除缓存组件
        //this.$store.commit('setCacheComponents',  []);
        next();
    },

    destroyed : function destroyed() {
    },

    methods : {

        back:function(){

        },

        pay : function() {
            var that = this;
            this.$router.push({
                path : '/pay/code',
                query : {
                    userId : that.userId,
                    userName : that.userName,
                    appId : that.appId,
                    subject : that.subject,
                    totalAmount : that.totalAmount,
                }
            });
        },

        //初始化
        initialization : function() {

            this.userId = document.getElementById("userId").value;
            this.userName = document.getElementById("userName").value;
            this.subject = document.getElementById("subject").value;
            this.appId = document.getElementById("appId").value;
            this.totalAmount = document.getElementById("totalAmount").value;

            if(this.appId > 100){
                this.options = [
                    {
                        label: '0.01元1元宝',
                        value: '0.01',
                    },
                    {
                        label: '5000元宝',
                        value: '5',
                    },
                    {
                        label: '20000元宝',
                        value: '20'
                    },
                    {
                        label: '50000元宝',
                        value: '50'
                    },
                    {
                        label: '100000元宝',
                        value: '100',
                    },
                    {
                        label: '300000元宝',
                        value: '300'
                    },
                    {
                        label: '500000元宝',
                        value: '500'
                    },
                    {
                        label: '1000000元宝',
                        value: '1000'
                    },
                    {
                        label: '3000000元宝',
                        value: '3000'
                    }
                ];
            }else{
                this.options = [
                    {
                        label: '0.01元',
                        value: '0.01',
                    },
                    {
                        label: '10元',
                        value: '10',
                    },
                    {
                        label: '30元',
                        value: '30'
                    },
                    {
                        label: '50元',
                        value: '50'
                    },
                    {
                        label: '100元',
                        value: '100'
                    },
                    {
                        label: '200元',
                        value: '200',
                    },
                    {
                        label: '500元',
                        value: '500'
                    }
                ];
            }

        },

    }
});

//支付二维码组件
var code_component = Vue.extend({
    name: 'code',
    template : '#code-template',

    data : function() {
        return {
            userId:'',
            userName:'',
            appId:'',
            subject:'',
            totalAmount:0,

            codeResult:'',
            tradeResult:'',
            queryTimer:'',
            codeTimer:'',
            totalTime:300,
            hour:0,
            minute:0,
            second:0
        };
    },

    created : function() {

        this.initialization();
        //缓存组件
        this.$store.commit('setCacheComponents',  ['code']);
    },

    beforeRouteLeave: function (to, from, next) {
        var that = this;
        //清除缓存组件
        //this.$store.commit('setCacheComponents',  []);
        if(that.queryTimer){
            clearInterval(that.queryTimer);
        }
        next();
    },

    destroyed : function() {
    },

    methods : {

        back:function(){
            this.$router.back();
        },

        createQrCode:function(){
            var that = this;
            var url = "/trade/code/create";
            post(that,url,
                {'userId':that.userId,'userName':that.userName,'appId':that.appId,'subject':that.subject,'totalAmount':that.totalAmount},
                function(result){
                    console.log(result);
                    if(result){
                        that.codeResult = result.item;
                        if(that.codeResult.qrCode){
                            new QRCode(document.getElementById("qrCode"), {
                                text: that.codeResult.qrCode,
                                width: 200,
                                height: 200
                            });
                            that.queryTimer = setInterval(function(){
                                that.query();
                            },2000);
                        }else{
                            document.getElementById("qrCode").innerHTML = "<img src=\"../../images/qrcode.png\" width=\"200\" height=\"200\" style=\"border:1px solid #EFEFEF;\">";
                        }

                        that.codeTimer = setInterval(function(){
                            that.timeCode();
                        },1000);
                    }

                },
                function(){})
        },

        timeCode: function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;

            if (this.totalTime > 0) {
                day = Math.floor(this.totalTime / (60 * 60 * 24));
                hour = Math.floor(this.totalTime / (60 * 60)) - (day * 24);
                minute = Math.floor(this.totalTime / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(this.totalTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            this.hour = hour;
            this.minute = minute;
            this.second = second;
            if (hour <= 0 && minute <= 0 && second <= 0) {
                clearInterval(this.codeTimer);
                clearInterval(this.queryTimer);
                //自动取消
                this.cancel();
            }
            this.totalTime = this.totalTime - 1;
        },

        query: function () {
            var that = this;
            var url = "/trade/query";
            get(that,url,
                {'outTradeNo':that.codeResult.outTradeNo},
                function(result){
                    console.log(result);
                    if(result && result.resultCode == 0){
                        that.tradeResult = result.item;
                        if(result.tradeStatus == 'TRADE_SUCCESS'){
                            clearInterval(that.queryTimer);
                            clearInterval(that.codeTimer);
                            setTimeout(function(){
                                that.back();
                            },2000);
                        }
                    }
                },
                function(){})
        },

        cancel: function () {
            var that = this;
            var url = "/trade/cancel";
            get(that,url,
                {'outTradeNo':that.codeResult.outTradeNo},
                function(result){
                    console.log(result);
                    if(result && result.resultCode == 0){
                        clearInterval(that.queryTimer);
                        clearInterval(that.codeTimer);
                        that.back();

                    }
                },
                function(){})
        },

        //初始化
        initialization : function() {
            this.userId = this.$route.query.userId;
            this.userName = this.$route.query.userName;
            this.appId = this.$route.query.appId;
            this.subject = this.$route.query.subject;
            this.totalAmount = this.$route.query.totalAmount;

            console.log("this.userId:",this.userId);
            this.createQrCode();
        },

    }
});



/**定义路由*/
var routes = [
    {path : '/',redirect : '/pay'},    //router的重定向方法
    {path : '/pay',component : pay_component},
    {path : '/pay/code',component : code_component},
    {path : '*',redirect : '/pay'}     //其余路由重定向至首页
];

//创建 router 实例
var router = new VueRouter({
    routes: routes
});

//创建和挂载根实例。
var vue = new Vue({
    el : '#app',
    store : store,   //将store实例注入到根组件下的所有子组件中,子组件通过this.$store来访问store
    router : router, //通过vue配置中的router挂载router实例
    created : function created() {
        this.initialization();
    },
    computed: {
        cacheComponents : function () {
            return this.$store.getters.cacheComponents;
        }
    },
    methods : {
        //初始化数据
        initialization : function initialization(event) {
            var _self = this;
            _self.$store.commit('setToken',"ym-payment");
        },

    }
});


