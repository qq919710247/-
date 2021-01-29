$(function () {
    const { layer, form } = layui

    //获取用户信息并渲染到页面
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {

            if (res.status !== 0) {
                return layer.msg('获取信息失败')
            }

            const { data } = res

            form.val('edit-userinfo', data)
        })
    }

    initUserInfo()

    //表单验证
    form.verify({
        nick: [
            /^\w{1,6}$/,
            '昵称长度为1-6个字符'
        ]
    })

    //提交修改
    $('.base-info-form').submit(function (e) {
        e.preventDefault()

        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改信息失败')
                }

                layer.msg('修改信息成功')
                window.parent.getUserInfo()
            })
    })

    //重置功能
    $('#reset-btn').click(function (e) {
        e.preventDefault()

        initUserInfo()
    })
})