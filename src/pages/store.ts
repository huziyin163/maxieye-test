import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { message } from 'antd';

import { downLoadAsJson, LabelType, BoxItem } from './utils';

// 点云点大小
const POINTSIZE = 0.1;

// 颜色
const CAR_COLOR = '#DC143C'; // 红色
const TRANK_COLOR = '#FFFF00'; // 黄色

export class ThreeHelper {
  scene; // 场景

  gl; // WebGLRenderer

  camera; // 相机

  orbit: OrbitControls | undefined; // 控制器 - 控制相机

  transControl: TransformControls | undefined; // 单个立体框的控制器 - 控制立体框

  allBoxMap: Map<string, BoxItem>;

  constructor() {
    this.init();
    this.render();
  }

  init = () => {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(new THREE.AxesHelper(50));

    // camera透视相机
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

    // orbit 轨道控制器
    this.orbit = new OrbitControls(this.camera, this.gl.domElement);
    this.orbit.target.set(0, 0, 0);
    this.orbit.addEventListener('change', this.render);
    this.orbit.update();
    this.scene.add(this.orbit);

    // TransformControls 变换控制器
    this.transControl = new TransformControls(this.camera, this.gl.domElement);
    this.transControl.addEventListener('change', this.render);
    this.transControl.addEventListener('dragging-changed', (event) => {
      if (this.orbit) {
        this.orbit.enabled = !event.value;
      }
    });
    this.scene.add(this.transControl);

    // 储存box需要打印的信息
    this.allBoxMap = new Map();
  };

  render = () => {
    this.gl.render(this.scene, this.camera);
  };

  /** 加载pcd 文件  */
  loadPcdItem = () => {
    const loader = new PCDLoader();
    loader.load(
      '04.pcd',
      (points) => {
        points.material.size = POINTSIZE;
        this.scene.add(points);
        this.render();
      },
      undefined,
      () => {
        message.error('pcd文件加载失败');
      },
    );
  };

  /** 标记卡车red */
  drawRedBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: CAR_COLOR,
      wireframe: true,
      transparent: true,
    }); // 空心立体框
    const cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);
    this.transControl.attach(cube);
    this.transControl.setMode('translate');

    this.allBoxMap.set(cube.uuid, {
      color: TRANK_COLOR,
      type: LabelType.TRANK,
      position: cube.position,
      size: cube.scale,
    });
  };

  /** 标记小汽车yellow */
  drawYellowBox = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: TRANK_COLOR,
      wireframe: true,
    }); // 空心立体框
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.transControl.attach(cube);
    this.transControl.setMode('translate');

    this.allBoxMap.set(cube.uuid, {
      color: CAR_COLOR,
      type: LabelType.CAR,
      position: cube.position,
      size: cube.scale,
    });
  };

  /** 导出 */
  exportJson = () => {
    const boxMap: Map<string, BoxItem> = new Map();
    this.scene.children.map((mesh: THREE.Mesh, i: number) => {
      if (mesh.type === 'Mesh') {
        boxMap.set(`${mesh.uuid}`, {
          ...this.allBoxMap.get(mesh.uuid),
          position: mesh.position,
          size: mesh.scale,
        });
      }
    });
    downLoadAsJson(boxMap);
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
    this.orbit?.dispose();
    this.transControl?.dispose();
    this.camera?.clear();
  };
}
