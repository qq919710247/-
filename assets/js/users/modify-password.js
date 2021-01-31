$(function () {
    const { form, layer } = layui

    //表单校验
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码为6到12位'
        ],
        confirmPass: function (val) {
            if (val !== $('#pass').val()) {
                return '两次密码输入不一致'
            }
        }
    })

    //表单提交事件
    $('.layui-form').submit(function (e) {
        e.preventDefault()

        //发起ajax请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改密码失败')
                }
                layer.msg('修改密码成功')

                //清楚token令牌
                localStorage.removeItem('token')
            })
    })



})