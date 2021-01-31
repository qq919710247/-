//为全局axios请求设置根路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log('---请求之前', config);

    //获取本地存储令牌
    const token = localStorage.getItem('token') || ''

    //发送请求之间判断是否有/my开头请求的路径，如果有添加hearder请求头
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log('---响应之前');
    const { message, status } = response.data
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token')
        location.href = './login.html'
    }
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});