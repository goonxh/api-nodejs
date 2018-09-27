## api.xiehao.xin

### github地址：[https://github.com/goonxh/api-nodejs](https://github.com/goonxh/api-nodejs)

1.api：[https://api.xiehao.xin/article/getArticle](https://api.xiehao.xin/article/getArticle)

获取博客[blog.xiehao.online](http://blog.xiehao.online)的所有文章标题与链接等信息。

method:GET

2.api：[https://api.xiehao.xin/ooxxPic](https://api.xiehao.xin/ooxxPic)

获取煎蛋每日妹子精选图链接，每天早上7点和晚上7点更新。

method:GET

[预览地址](https://me.xiehao.online/ooxxpic)

3.api：[https://api.xiehao.xin/string2qrcode](#)

输入任意字符串(网址，名称等)都可输出对应二维码url地址。

method:GET

options:

- `stringVal: String`
- `codeSize: Number  // QRcode大小`
- `darkColor: String  // 二维码颜色 必须为hex值 默认为 #000000ff`
- `lightColor: String  // 二维码背景颜色 必须为hex值 默认为 #ffffffff`

[预览地址](https://me.xiehao.online/string2qrcode)