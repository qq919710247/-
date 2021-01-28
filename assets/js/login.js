$(function () {
    //1.切换注册登录
    $('.link a').click(function () {
        $('.layui-form').toggle()
    })

    //2.从layui中提取form表单块
    const { form } = layui
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePass: function (value) {
            if (value !== $('#pass').val()) {
                return '密码不一致'
            }
        }
    })

    //3.实现注册功能
    $('.reg-form').submit(function (e) {
        e.preventDefault()

        //发送ajax请求
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);

                //注册失败提示框
                if (res.status !== 0) {
                    return layer.msg('注册失败')
                }
                layer.msg('注册成功')
                $('.login-form a').click()
            })
    })

    //4.实现登录功能
    $('.login-form').submit(function (e) {
        e.preventDefault()

        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }

                //本地存储
                localStorage.setItem('token', res.token)

                layer.msg('登录成功')

                location.href = 'index.html'

            })
    })

})