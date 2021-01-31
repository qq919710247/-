function getUserInfo() {
    axios.get('/my/userinfo').then(res => {
        console.log(res);
        if (res.status !== 0) {
            return layer.msg('获取用户信息失败')
        }

        const { data } = res
        //获取用户名
        const name = data.nickname || data.username
        //渲染昵称
        $('.nickname').text(`欢迎${name}`).show()
        //渲染头像
        if (data.user_pic) {
            $('.avatar').prop('src', data.user_pic).show()
            $('.text-avatar').hide()
        } else {
            $('.text-avatar').text(name[0].toUpperCase()).show()
            $('.avatar').hide()
        }
    })
}

$(function () {
    const { layer } = layui

    function getUserInfo() {
        axios.get('/my/userinfo').then(res => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }

            const { data } = res
            //获取用户名
            const name = data.nickname || data.username
            //渲染昵称
            $('.nickname').text(`欢迎${name}`).show()
            //渲染头像
            if (data.user_pic) {
                $('.avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show()
                $('.avatar').hide()
            }
        })
    }

    getUserInfo()

    //点击退出
    $('#logout').click(function () {
        //清除token
        localStorage.removeItem('token')

        //跳转主页
        location.href = './login.html'
    })
})