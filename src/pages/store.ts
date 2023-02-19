import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader';
import { message } from 'antd';

import { downLoadAsJson, LabelType, BoxItem } from './utils';

// 点云点大小
const POINTSIZE = 0.1;

const CAR_COLOR = '#DC143C';
const TRANK_COLOR = '#FFFF00';

export class ThreeHelper {
  scene; // 场景

  gl; // WebGLRenderer

  camera; // 相机

  orbit: OrbitControls | undefined; // 控制器 - 控制相机

  transControl: TransformControls | undefined; // 单个立体框的控制器 - 控制立体框

  allBoxMap: BoxItem[];

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
    this.scene.add(this.transControl);
  };

  render = () => {
    this.gl.render(this.scene, this.camera);
  };

  /** 加载单个文件  */
  loadPcdItem = (): Promise<any> => {
    const loader = new PCDLoader();

    return new Promise((_resolve, reject) => {
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
          // eslint-disable-next-line prefer-promise-reject-errors
          reject();
        },
      );
    });
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
    this.transControl.addEventListener('dragging-changed', (event) => {
      console.log('==>', event);
      // event.
      if (this.orbit) {
        this.orbit.enabled = !event.value;
      }
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
  };

  /** 导出 */
  exportJson = () => {
    const boxMap: Map<string, BoxItem> = new Map();
    console.log('==>', this.scene);
    this.scene.children.map((mesh: THREE.Mesh, i: number) => {
      if (mesh.type === 'Mesh') {
        boxMap.set(`${i}`, {
          name: '3',
          type: LabelType.CAR,
          position: mesh.geometry.attributes.position,
        });
      }
    });

    console.log('==>', boxMap);
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
    this.camera?.clear();
  };
}
