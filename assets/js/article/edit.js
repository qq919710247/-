$(function () {
    const { form } = layui
    let state = ''
    // console.log(location.search);

    // 获取查询参数id的值
    const arr = location.search.slice(1).split('=')
    const id = arr[1]
    // console.log(id);

    //发送请求到服务器，根据id获取文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`).then(res => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            //给form表单赋值
            form.val('edit-form', res.data)

            //调用富文本编辑器封装的方法初始化
            initEditor()

            //替换裁剪区中的封面图片
            $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
        })
    }



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

                //动态创建表单元素，手动更新表单
                form.render('select')

                //调用详情
                getArtDetail(id)
            })
    }

    function publishArticle(fd) {
        //发送之前向formdata数据中添加一条id数据
        fd.append('Id', id)
        axios.post('/my/article/edit', fd)
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布失败!')
                }
                layer.msg('发布成功!')

                location.href = './list.html'
                window.parent.$('.layui-this').prev().addClass('layui-this').siblings().removeClass('layui-this')
            })
    }

    getCateList()



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



        //向fd中放入裁剪图片并转二进制
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            const fd = new FormData(this)

            // fd.forEach(item => {
            //     console.log(item);
            // });

            //向fd中添加state文章状态
            fd.append('state', state)

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