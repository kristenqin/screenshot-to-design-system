# 设计 Token 提取

## 目标

从截图中提取可复用设计值，让重建结果不只是“看起来像”，而是能被系统化编辑。

## 颜色

不要直接对整张图做 naive palette extraction。

截图里会有很多噪音：

- 阴影
- 抗锯齿
- 图片
- 图标
- 渐变
- 压缩痕迹
- disabled 状态

推荐提取顺序：

1. 大面积背景色
2. 高频文字色
3. 高频边框色
4. 按钮和链接等主交互色
5. success / warning / error / info 等语义色
6. disabled 和 muted 色

图片区域应尽可能从 token 提取里排除。

## 字体

精确识别 font-family 目前不可靠。

第一版应该识别字体系统特征：

- 字体类别
- 字号
- 字重
- line height
- 文本角色
- heading / body / label / caption scale

实用映射：

- macOS / iOS：SF Pro 风格
- Windows：Segoe UI 风格
- Web SaaS：Inter 或 system-ui
- Material：Roboto

## 间距、圆角、边框和阴影

重点提取重复出现的值：

- 常见 gap
- container padding
- section margin
- grid columns
- row height
- table cell padding
- sidebar width
- header height
- radius scale
- border width / color
- elevation / shadow levels

## 风险

主题色和字体推断都需要真实截图实验验证，不能只靠理论规则。

