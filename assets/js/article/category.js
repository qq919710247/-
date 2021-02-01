$(function () {
    const { form } = layui

    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);

                //判断失败
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }

                //使用模板渲染页面
                const htmlStr = template('tpl', res)
                // console.log(htmlStr);
                $('tbody').html(htmlStr)
            })
    }

    getCateList()

    //绑定添加按钮点击事件
    var index;
    $('.add-btn').click(function () {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('.add-form-container').html(), //这里content是一个普通的String
            area: ['500px', '250px']
        });
    })

    //监听添加表单提交事件
    $(document).on('submit', '.add-form', function (e) {
        e.preventDefault()

        //发送ajax请求
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }


                layer.msg('添加成功!')

                //成功之后关闭按钮
                layer.close(index)

                //渲染页面
                getCateList()
            })
    })

    //监听编辑表单点击事件
    $(document).on('click', '.edit-btn', function () {
        // console.log(123);
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('.edit-form-container').html(), //这里content是一个普通的String
            area: ['500px', '250px']
        });

        //发送ajax请求
        const id = $(this).data('id')
        // console.log(id);
        axios.get(`/my/article/cates/${id}`)
            .then(res => {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }

                //对编辑表单进行赋值
                form.val('edit-form', res.data)
            })

    })

    //监听编辑表单提交事件
    $(document).on('submit', '.edit-form', function (e) {
        e.preventDefault()

        axios.post('/my/article/updatecate', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('修改失败!')
                }
                // console.log(res);
                getCateList()

                layer.msg('修改成功!')

                //成功之后关闭按钮
                layer.close(index)
            })

    })

    //监听删除按钮事件
    $(document).on('click', '.del-btn', function () {
        // console.log(123);

        const id = $(this).data('id')
        // console.log(id);
        axios.get(`/my/article/deletecate/${id}`)
            .then(res => {
                // console.log(res);

                index = layer.confirm('确认删除?', { icon: 2, title: '提示' }, function (index) {
                    if (res.status == 1) {
                        return layer.msg('删除失败，该项无法删除!')
                    } else if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }

                    layer.close(index);

                    layer.msg('删除成功!')

                    getCateList()
                });

            })
    })
})