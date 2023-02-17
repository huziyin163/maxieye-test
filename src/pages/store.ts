import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { message } from 'antd';

// 点云点大小
const POINTSIZE = 0.1;

export class ThreeHelper {
  scene; // 场景

  gl; // WebGLRenderer

  camera; // 相机

  controls: OrbitControls | undefined; // 控制器 - 控制相机
  constructor() {
    this.init();
    this.animate();
  }

  init = () => {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(new THREE.AxesHelper(50));

    // camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    this.camera.position.set(0, 0, 200); // 设置相机位置
    this.camera.up.set(0, 0, 1);

    // WebGLRenderer
    this.gl = new THREE.WebGLRenderer({
      antialias: true, // 渲染器 - antialias抗锯齿
    });
    this.gl.setPixelRatio(window.devicePixelRatio); // 设备画布像素比
    this.gl.setSize(window.innerWidth, window.innerHeight); // 设置画布尺寸
    this.gl.autoClear = false; // 关闭自动清除

    // controls 轨道控制器
    this.controls = new OrbitControls(this.camera, this.gl.domElement);
    this.controls.minDistance = 10; // 限制视线最近距离
    this.controls.maxDistance = 500; // 限制视线多远距离
    this.controls.enableDamping = true; // 是否开起控制器阻尼系数（理解为对旋转的阻力，系数越小阻力越小）
    this.controls.dampingFactor = 0.05; // 设置阻尼系数（如果设置阻尼系数，这涉及到了模型的动态渲染所以在渲染器中需要一直调用.update()。调用update()的前提是需要建立一个时钟 如下）
    this.controls.minPolarAngle = -Infinity; // 控制器垂直方向最小旋转角度（理解为逆时针旋转角度）
    this.controls.maxPolarAngle = Infinity; // 控制器垂直方向最大旋转角度（理解为顺时针旋转角度）
    this.controls.target.set(0, 0, 0);
  };

  animate = () => {
    this.gl.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  /** 加载单个文件  */
  loadPcdItem = (): Promise<any> => {
    const loader = new PCDLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        '04.pcd',
        (points) => {
          points.material.size = POINTSIZE;
          this.scene.add(points);
        },
        undefined,
        () => {
          message.error('pcd文件加载失败');
          // eslint-disable-next-line prefer-promise-reject-errors
          reject();
        },
      );
    });
  };

  drawBoxGeometry = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  };

  /** resize */
  resize = () => {
    this.gl.setSize(window.innerWidth, window.innerHeight);
  };
  /** 卸载前清空缓存 */
  unintall = () => {
    this.gl?.dispose();
    this.gl?.forceContextLoss();
    this.scene?.clear();
    this.controls?.dispose();
    this.camera?.clear();
  };
}
