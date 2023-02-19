## 一、如何运行
```shell
yarn && yarn start
```
node参考版本: v16.1.0

## 二、期望效果
1. 正确加载pcd文件;
2. 可进行立体框标注 【可选标签: 卡车(red) 小汽车(yellow)】
3. 标注结果包括立体框名称、大小(长宽高)、位置
4. 标注结果点击提交按钮下载结果文件(json文件)
5. 源码打包提交



## 三、参考文档
[变换控制器](https://threejs.org/docs/?q=TransformControls#examples/zh/controls/TransformControls);

[变换控制器-示例](https://threejs.org/examples/#misc_controls_transform);

[3d点云标注](https://www.bilibili.com/video/BV1jf4y1f7Ln/?spm_id_from=333.999.0.0&vd_source=eada74113fa71c072c8536189a58dfd9);

![参考标注示例](./demo.jpeg)