$(function () {
    const { form, laypage } = layui

    //渲染页面
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

    getCateList()

    //发起请求，获取文章列表数据
    const query = {
        pagenum: 1,
        pagesize: 5,
        cate_id: '',
        state: '',
    }


    function renderTable() {
        axios.get('/my/article/list', { params: query })
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }

                //注册过滤器
                template.defaults.imports.dateFormat = function (date) {
                    return moment(date).format('YYYY/MM/DD HH:mm:ss')
                };

                const htmlStr = template('tpl', res)
                // console.log(htmlStr); 
                $('tbody').html(htmlStr)

                renderPage(res.total)
            })
    }

    renderTable()

    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 4, 5], //每页的数据条数
            curr: query.pagenum, //当前页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//分页器布局
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                query.pagenum = obj.curr
                query.pagesize = obj.limit


                //首次不执行
                if (!first) {
                    renderTable()
                }
            }
        });
    }

    //表单筛选功能  
    $('.layui-form').submit(function (e) {
        e.preventDefault()

        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        // console.log(cate_id, state);

        query.cate_id = cate_id
        query.state = state

        //发送请求页码值改为1
        query.pagenum = 1

        renderTable()
    })

    //删除按钮
    $(document).on('click', '.del-btn', function () {
        const id = $(this).data('id')
        // console.log(id);
        axios.get(`/my/article/delete/${id}`)
            .then(res => {
                // console.log(res);

                index = layer.confirm('确认删除?', { icon: 2, title: '提示' }, function (index) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }

                    layer.close(index);

                    layer.msg('删除成功!')

                    //当前页只有一条数据的时候，点击删除调到上一页
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        query.pagenum--
                    }

                    renderTable()
                });

            })
    })

    //编辑按钮
    $(document).on('click', '.edit-btn', function () {
        const id = $(this).data('id')

        location.href = `./edit.html?id=${id}`
        window.parent.$('.layui-this').next().addClass('layui-this').siblings().removeClass('layui-this')

    })

})