$(function () {
    const { form } = layui
    let state = ''
    //封装渲染服务器列表数据
    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }

                //遍历下拉选择项
                res.data.forEach(item => {
                    $('.cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
                });

                form.render('select')
            })
    }

    function publishArticle(fd) {
        axios.post('/my/article/add', fd)
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                layer.msg('发布成功!')

                location.href = './list.html'
                window.parent.$('.layui-this').prev().addClass('layui-this').siblings().removeClass('layui-this')
            })
    }

    getCateList()

    //调用富文本编辑器封装的方法
    initEditor()

    //图片裁剪区域
    // debugger;
    const $image = $('#image')

    $image.cropper({
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    });

    //为选择封面按钮绑定点击事件
    $('.choose-btn').click(function () {
        $('#file').click()
    })

    //给文档绑定change事件
    $('#file').change(function () {
        if (this.files.length == 0) {
            return
        }

        // console.log(this.files[0]);
        const imgUrl = URL.createObjectURL(this.files[0])
        $image.cropper('replace', imgUrl)
    })

    //监听表单的提交事件
    $('.publish-form').submit(function (e) {
        e.preventDefault()

        const fd = new FormData(this)

        // fd.forEach(item => {
        //     console.log(item);
        // });

        //向fd中添加state文章状态
        fd.append('state', state)

        //向fd中放入裁剪图片并转二进制
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            // console.log(blob);
            //向fd中添加图片
            fd.append('cover_img', blob)

            //发送ajax请求，提交数据到服务器
            publishArticle(fd)
        })



    })

    //点击发布和存为草稿按钮，改变state的值
    $('.last-row button').click(function () {
        state = $(this).data('state')
        // console.log(state);
    })
})