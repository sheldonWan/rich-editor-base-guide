# 富文本编辑器基础指北

### 0x1编辑器实现基本要素
1. 可编辑区域
2. 交互事件
3. 焦点控制
4. 富文本转换

### 0x1可编辑区域实现
1. input、textarea
2. contentEditable

### 0x2交互事件
1. 点击
2. 拉选
3. 拖拽
4. 输入
5. 删除
6. 撤回
7. 重做
8. 复制
9. 粘贴
10. ......

### 0x3焦点控制(重点)
1. Selection
2. Range

### 0x4富文本转换
1. document.execCommand[文档][1]

### 0x5整套交互流程

#### 加粗
    拉选文字 => 保存range =>  点击菜单 => 还原range => 执行命令BOLD
#### 添加链接
    拉选文字 => 保存range => 点击菜单 => 弹窗 => 输入链接 => 还原range => 执行命令createLink


[1]: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand