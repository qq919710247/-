$(function () {
    // 1.1 获取裁剪区域的 元素对象
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    //绑定上传事件 
    $('#upload-btn').click(function () {
        $('#file').click()
    })

    //监听文件框状态改变
    $('#file').change(function () {
        // console.log(this.files);

        if (this.files.length == 0) {
            return
        }

        //把文件转成url形式
        const imgUrl = URL.createObjectURL(this.files[0])
        // console.log(imgUrl);

        //替换裁剪区图片
        $image.cropper('replace', imgUrl)
    })

    //上传图片到服务器
    $('#save-btn').click(function () {
        //获取裁剪后图片的64位格式
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg')
        // console.log(dataUrl);

        //手动构建查询参数
        const search = new URLSearchParams()
        search.append('avatar', dataUrl)

        //发送请求
        axios.post('/my/update/avatar', search)
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('上传失败')
                }

                window.parent.getUserInfo()

                layer.msg('修改成功')
            })

    })


})
