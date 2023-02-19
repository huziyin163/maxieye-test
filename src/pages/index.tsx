import { useEffect, useMemo, useRef } from 'react';
import GUI from 'lil-gui';

import { ThreeHelper } from './store';
import './index.less';

export default function IndexPage() {
  const lidar: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const lidarThree: ThreeHelper = useMemo(() => {
    return new ThreeHelper();
  }, []);
  const gui = useMemo(() => {
    return new GUI();
  }, []);

  /** 标记卡车red */
  const addRedTruck = () => {
    lidarThree.drawRedBox();
    lidarThree.render();
  };
  /** 标记小汽车yellow  */
  const addYellowCar = () => {
    lidarThree.drawYellowBox();
    lidarThree.render();
  };
  /** 删除卡车*/
  const removeTruck = () => {};

  /** 删除小汽车 */
  const removeCar = () => {};
  /** 导出json文件 */
  const exportJson = () => {
    lidarThree.exportJson();
  };

  const onLoadPcd = () => {
    lidarThree.loadPcdItem();
  };

  const onPointerDown = (event) => {
    // onDownPosition.x = event.clientX;
    // onDownPosition.y = event.clientY;
  };

  const onPointerUp = (event) => {
    // onUpPosition.x = event.clientX;
    // onUpPosition.y = event.clientY;
    // if (onDownPosition.distanceTo(onUpPosition) === 0)
    //   transformControl.detach();
  };

  const onDrawCarBox = () => {
    // lidarThree.drawBoxGeometry();
    // console.log('===>', p);
  };

  /** 更新立体框的size */
  const updateSize = () => {};

  // todo
  const onResize = () => {};

  /** 初始化GUI */
  const initGUI = () => {
    const params = {
      width: 15,
      height: 15,
      depth: 15,
      addRedTruck: addRedTruck,
      addYellowCar: addYellowCar,
      removeTruck: removeTruck,
      removeCar: removeCar,
      exportJson: exportJson,
    };

    const folderTrunk = gui.addFolder('folderTrunk');
    const folderCar = gui.addFolder('folderCar');
    folderTrunk.add(params, 'width', 500, 500).step(0.01).onChange(updateSize);
    folderTrunk.add(params, 'height', 500, 500).step(0.01).onChange(updateSize);
    folderTrunk.add(params, 'depth', 500, 500).step(0.01).onChange(updateSize);
    folderCar.add(params, 'width', 500, 500).step(0.01).onChange(updateSize);
    folderCar.add(params, 'height', 500, 500).step(0.01).onChange(updateSize);
    folderCar.add(params, 'depth', 500, 500).step(0.01).onChange(updateSize);
    gui.add(params, 'addRedTruck');
    gui.add(params, 'addYellowCar');
    gui.add(params, 'removeTruck');
    gui.add(params, 'removeCar');
    gui.add(params, 'exportJson');
  };

  /** 快捷键监听事件 */
  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case 82: // R
        lidarThree.transControl.setMode('scale');
        break;
    }
  };

  useEffect(() => {
    if (lidar.current && lidar.current.childNodes.length === 0) {
      lidar.current?.appendChild(lidarThree.gl.domElement);
    }
    initGUI();
    lidarThree.loadPcdItem();
    lidarThree.render();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      // lidarThree.unintall();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return <div ref={lidar} />;
}
