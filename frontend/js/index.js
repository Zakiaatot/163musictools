const API=""



const $axios=axios.create({
    timeout:3000,
    baseURL:API
})
$axios.defaults.withCredentials = true // 允许携带cookie
$axios.defaults.crossDomain = true

const APP={
    methods:{
        changepage(){
            this.animation()
        },
        phonelisten(e){
            this.phoneinput=e.target.value
        },
        passwordlisten(e){
            this.passwordinput=e.target.value
        },
        animation(){
            const animationvars={
                mystyle: document.querySelector('.mystyle'),
                mystyle_brand: document.querySelector('.mystyle-brand'),
                mystyle_wrapper: document.querySelector('.mystyle-wrapper'),
                mystyle_login: document.querySelector('.mystyle-login'),
                mystyle_wrapper_height: 0,
                password_group: document.querySelector('.password-group'),
                password_group_height: 0,
                mystyle_index: document.querySelector('.mystyle-index'),
                box: document.getElementsByClassName('mystyle-box'),   
            }
            const animationfunction={
                brand() {
                    animationvars.mystyle_brand.classList += ' mystyle-animated'
                    setTimeout(() => {
                        animationvars.mystyle_brand.classList.remove('mystyle-animated')
                    }, 1000)
                },
                index() {
                    animationvars.mystyle_login.className += ' mystyle-animated'
                    setTimeout(() => {
                        animationvars.mystyle_login.style.display = 'none'
                    }, 500)
                    animationvars.mystyle_index.style.display = 'block'
                    animationvars.mystyle_index.className += ' mystyle-animated-flip'
            
                    this.setHeight(animationvars.mystyle_index.offsetHeight)
                },
                login() {
                    animationvars.mystyle_index.classList.remove('mystyle-animated-flip')
                    animationvars.mystyle_index.className += ' mystyle-animated-flipback'
                    animationvars.mystyle_login.style.display = 'block'
                    animationvars.mystyle_login.classList.remove('mystyle-animated')
                    animationvars.mystyle_login.className += ' mystyle-animatedback'
                    setTimeout(() => {
                        animationvars.mystyle_index.style.display = 'none'
                    }, 500)
                    
                    setTimeout(() => {
                        animationvars.mystyle_index.classList.remove('mystyle-animated-flipback')
                        animationvars.mystyle_login.classList.remove('mystyle-animatedback')
                    },1000)
            
                    this.setHeight(animationvars.mystyle_login.offsetHeight)
                },
                setHeight(height) {
                    animationvars.mystyle_wrapper.style.minHeight = height + 'px'
                }
            }


            animationfunction.brand()
            if(this.animationstatus==false){
                this.animationstatus=!this.animationstatus
                animationfunction.index()
            }
            else {
                this.animationstatus=!this.animationstatus
                animationfunction.login()
            }
        },
        login(){
            this.loginbtnstatus=true
            loginbtn=document.querySelector('#loginbtn span')
            loginbtn.innerHTML="请稍等"


            var _this=this
            $axios.post('/login', {
                phone: this.phoneinput,
                password: md5(this.passwordinput)
              })
           .then(function (response) {
                console.log(response)
                if(response.status!=200){
                   ElementPlus.ElMessage.error('请求失败,稍后再试！')
                }
                else{
                    if(response.data.status==0){
                        ElementPlus.ElMessage.error(response.data.msg.message?response.data.msg.message:(response.data.msg.msg?response.data.msg.msg:response.data.msg))
                    }
                    else{
                        ElementPlus.ElMessage({
                            message: response.data.msg.msg,
                            type: 'success',
                        }) 
                        setTimeout(() => {
                            _this.changepage()
                        }, 500)
                        _this.updateuserinfo()
                    }
                }
              })
              .catch(function (error) {
                ElementPlus.ElMessage.error(error.message+'\n'+'请求失败！')
              }).then(()=>{
                this.loginbtnstatus=false
                loginbtn.innerHTML="登录"
              })
        },
        updateuserinfo(){
  
            var _this=this
            $axios.post('/checkinfo')
              .then(function (response) {
                if(response.status!=200){
                   ElementPlus.ElMessage.error('用户信息获取失败请重新登录')
                }
                else{
                    if(response.data.status==0){
                        ElementPlus.ElMessage.error(response.data.msg.message?response.data.msg.message:(response.data.msg.msg?response.data.msg.msg:response.data.msg))
                    }
                    else{
                        _this.avatarsrc=response.data.msg.msg.userdata.avatarUrl
                        const nickname=document.querySelector('.nickname')
                        nickname.innerHTML=response.data.msg.msg.userdata.nickname
                        const level=document.querySelector('.level')
                        level.innerHTML="LV:"+response.data.msg.msg.userdata.level
                        const signature=document.querySelector('.signature')
                        signature.innerHTML=response.data.msg.msg.userdata.signature
                        const playcount=document.querySelector('.playcount')
                        playcount.innerHTML="播放量: "+response.data.msg.msg.userdata.playcount
                        const logincount=document.querySelector('.logincount')
                        logincount.innerHTML="登录天数: "+response.data.msg.msg.userdata.logincount                         
                    }
                }
              })
              .catch(function (error) {
                ElementPlus.ElMessage.error(error.message+'\n'+'请求失败！')
              })
        },
        signin(){
            this.signinbtnstatus=true
            const signinbtn=document.querySelector('#signin span')
            signinbtn.innerHTML="请稍等"
            $axios.post('/signin')
              .then((response)=>{
                if(response.status!=200){
                    ElementPlus.ElNotification({
                    title: '发生错误了捏！',
                    message: '服务器请求失败，稍后再试吧！',
                    type: 'error',
                    })
                }
                else{
                    if(response.data.status==0){
                        ElementPlus.ElNotification({
                        title: '发生错误了捏！',
                        message: response.data.msg.message?response.data.msg.message:(response.data.msg.msg?response.data.msg.msg:response.data.msg),
                        type: 'error',
                        })
                    }
                    else{
                        ElementPlus.ElNotification({
                        title: 'Success!',
                        message: response.data.msg.msg.msg+"经验+"+response.data.msg.msg.point+" 别重复签到，因为只会加一次经验",
                        type: 'success',
                        })
                        this.elmmsg2={
                            title:response.data.msg.msg.msg+"  经验 +"+response.data.msg.msg.point,
                            type:'success',
                            show:true
                        }                      
                    }
                }
              })
              .catch((error)=>{
                ElementPlus.ElMessage.error(error.message+'\n'+'请求失败！')
              }).then(()=>{
                signinbtn.innerHTML="签到"
                setTimeout(() => {
                    this.signinbtnstatus=false
                    this.elmmsg2={
                        title:'hello,觉得好用就来我的github star一下叭!有问题和建议欢迎提 issue',
                        type:'success',
                        show:false
                    }
                }, 3000);
              })
        },
        daka(){
            const dakabtn=document.querySelector('#daka span')
            dakabtn.innerHTML="正在打卡中，稍等！"
            this.dakabtnstatus=true
            var isfinish=false
            $axios.post('/daka',{},{timeout:60*1000}).then((response)=>{
                if(response.status!=200){
                    ElementPlus.ElNotification({
                    title: '发生错误了捏！',
                    message: '服务器请求失败，稍后再试吧！',
                    type: 'error',
                    })
                }
                else{
                    if(response.data.status==0){
                        ElementPlus.ElNotification({
                        title: '发生错误了捏！',
                        message: response.data.msg.message?response.data.msg.message:(response.data.msg.msg?response.data.msg.msg:response.data.msg),
                        type: 'error',
                        })
                    }
                    else{
                        ElementPlus.ElNotification({
                        title: 'Success!',
                        message: "成功听歌："+response.data.msg.count+"首",
                        type: 'success',
                        })
                        this.elmmsg2={
                            title:"成功听歌："+response.data.msg.count+"首",
                            type:'success',
                            show:true
                        }                      
                    }
                }
              })
              .catch((error)=>{
                ElementPlus.ElMessage.error(error.message+'\n'+'请求失败！')
              }).then(()=>{
                isfinish=true
                this.showstatus=true
                dakabtn.innerHTML="打卡"
                this.updateuserinfo()
                setTimeout(() => {
                    this.dakabtnstatus=false
                    this.elmmsg2={
                        title:'Hello!,觉得好用就来我的 github star一下叭!有问题和建议欢迎提 issue 哦!',
                        type:'success',
                        show:false
                    }
                }, 3000);
            })

            //轮询
            const promsg=document.querySelector("#progressmsg")
            setTimeout(() => {
                this.showstatus=false
                var lx=setInterval(() => {
                    $axios.post('/dakaprogress').then((response)=>{
                        if(response.data.msg.count){
                                this.progresspercentage=parseInt((response.data.msg.count/350)*100)
                                promsg.innerHTML="已听："+response.data.msg.count+"首"
                        }
                        if(isfinish){
                                clearInterval(lx)
                        }
                        })
                }, 500)
            },1000);
        },
        logout(){
            this.logoutbtnstatus=true
            logoutbtn=document.querySelector('#logout span')
            logoutbtn.innerHTML="请稍等"

            var _this=this
            $axios.post('/logout')
           .then(function (response) {
                if(response.status!=200){
                   ElementPlus.ElMessage.error('请求失败,稍后再试！')
                }
                else{
                    if(response.data.status==0){
                        ElementPlus.ElMessage.error(response.data.msg.message?response.data.msg.message:(response.data.msg.msg?response.data.msg.msg:response.data.msg))
                    }
                    else{
                        ElementPlus.ElMessage({
                            message: response.data.msg.msg,
                            type: 'success',
                        }) 
                        setTimeout(() => {
                            _this.changepage()
                        }, 500)
                        _this.avatarsrc='./img/logo.png'
                    }
                }
              })
              .catch(function (error) {
                ElementPlus.ElMessage.error(error.message+'\n'+'请求失败！')
              }).then(()=>{
                this.logoutbtnstatus=false
                logoutbtn.innerHTML="登录"
              })
        },
        
    },
    data(){
        return {
            animationstatus:'',
            phoneinput:'',
            passwordinput:'',
            loginbtnstatus:false,
            signinbtnstatus:false,
            dakabtnstatus:false,
            elmmsg1:{
                title:'欢迎光临,请输入正确的账号和密码',
                type:'success',
                show:false
            },
            elmmsg2:{
                title:'hello,觉得好用就来我的github star一下叭!有问题和建议欢迎提 issue',
                type:'success',
                show:false,
            },
            showstatus:true,
            progresspercentage:0,
            avatarsrc:'./img/logo.png',
            logoutbtnstatus:false,

        }
    },
    mounted(){
        this.animationstatus=false
        
        const loading = ElementPlus.ElLoading.service({
            lock: true,
            text: '请稍等',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        $axios.post('/checkinfo')
        .then((response)=>{
            if(response.status!=200){
                ElementPlus.ElNotification({
                    title: '错误',
                    message: "服务器连接失败请检查相关配置！",
                    type: 'error',
                    })
            }
            else{
                if(response.data.status==0){
                    // 未登录状态
                    ElementPlus.ElNotification({
                        title: '好耶！',
                        message: "服务器连接正常，欢迎使用！",
                        type: 'success',
                    })
                }
                else{
                    ElementPlus.ElNotification({
                        title: '好耶！',
                        message: "欢迎回来！",
                        type: 'success',
                    })
                    setTimeout(() => {
                        this.changepage()
                    }, 500)
                    this.updateuserinfo()
                }
            }
            })
            .catch((error)=>{
                ElementPlus.ElNotification({
                    title: '错误',
                    message: error.message+"  服务器连接失败请检查相关配置！",
                    type: 'error',
                    })
            }).then(()=>{
                setTimeout(() => {
                    loading.close()
                }, 1000);
            })
    },
    computed:{
        reg(){
            const regphone=new RegExp(/[0-9]{11,11}/)
            const regpassword=new RegExp(/.{6,30}/)
            loginbtn=document.querySelector('#loginbtn')
            if(regphone.test(this.phoneinput)&&regpassword.test(this.passwordinput)){
                return false
            }
            return true
        }
    }
}



const app = Vue.createApp(APP)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}//elementplus-icon
app.use(ElementPlus)
app.mount('#app')




