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

  /** 导出json文件 */
  const exportJson = () => {
    lidarThree.exportJson();
  };

  /** 初始化GUI */
  const initGUI = () => {
    const params = {
      width: 15,
      height: 15,
      depth: 15,
      addRedTruck: addRedTruck,
      addYellowCar: addYellowCar,
      exportJson: exportJson,
    };
    gui.add(params, 'addRedTruck');
    gui.add(params, 'addYellowCar');
    gui.add(params, 'exportJson');
  };

  /** 快捷键监听事件 */
  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case 82: // R
        lidarThree.transControl.setMode('scale');
        break;
      case 87: // W
        lidarThree.transControl.setMode('translate');
        break;
      case 69: // E
        lidarThree.transControl.setMode('rotate');
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
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <>
      <div ref={lidar} />
      <div className="modal">
        &nbsp;<b>快捷键👇🏻</b>
        <br />
        &nbsp;<b>w:</b> 移动 <br />
        &nbsp;<b>e:</b> 旋转
        <br />
        &nbsp;<b>r:</b> 缩放
        <br />
      </div>
    </>
  );
}
