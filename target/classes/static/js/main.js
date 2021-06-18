
//创建全局状态存储对象
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




//////////////////////////////////////////////////////////////////////////////////////////////////////

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
            productId:'',
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

            if(that.userName == ''){
                this.$toast('请输入账户名!');
                return;
            }

            this.$router.push({
                path : '/pay/code',
                query : {
                    userId : that.userId,
                    userName : that.userName,
                    subject : that.subject,
                    appId : that.appId,
                    productId : that.productId,
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
            this.productId = document.getElementById("productId").value;
            this.totalAmount = document.getElementById("totalAmount").value;

            this.options = [

                {
                    label: '10元',
                    value: '10'
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
                    value: '200'
                },
                {
                    label: '500元',
                    value: '500'
                }
            ];

        }

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
            subject:'',
            appId:'',
            productId:'',
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
            var url = "/pay/code/create";
            post(that,url,
                {'userId':that.userId,'userName':that.userName,'subject':that.subject,'appId':that.appId,'productId':that.productId,'totalAmount':that.totalAmount},
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
            var url = "/pay/query";
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
            var url = "/pay/cancel";
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
            this.subject = this.$route.query.subject;
            this.appId = this.$route.query.appId;
            this.productId = this.$route.query.productId;
            this.totalAmount = this.$route.query.totalAmount;

            console.log("this.userId:",this.userId);
            this.createQrCode();
        },

    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

//定义路由
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



