import { useEffect, useMemo, useRef } from 'react';
import { Button } from 'antd';

import { ThreeHelper } from './store';

export default function IndexPage() {
  const lidar: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const lidarThree: ThreeHelper = useMemo(() => {
    return new ThreeHelper();
  }, []);

  const onLoadPcd = () => {
    lidarThree.loadPcdItem();
  };

  const onDrawCarBox = () => {
    lidarThree.drawBoxGeometry();
  };

  useEffect(() => {
    if (lidar.current && lidar.current.childNodes.length === 0) {
      lidar.current?.appendChild(lidarThree.gl.domElement);
    }
    console.log('==>', lidarThree.gl);
    return () => {
      // lidarThree.unintall();
    };
  }, []);

  return (
    <div>
      <div>
        加载附件包含的pcd文件，并完成以下功能 期望效果： <br />
        1）正确加载pcd文件 <br />
        2）可进行立体框标注 【可选标签: 卡车（red） 小汽车（yellow）】 <br />
        3）标注结果包括立体框名称、大小（长宽高）、位置、颜色 <br />
        4）标注结果点击提交按钮下载结果文件（json文件） <br />
        5）源码打包提交
      </div>
      <div>
        <div>
          <Button onClick={onLoadPcd}>加载pcd文件</Button>
          <Button onClick={onDrawCarBox}>卡车(red)</Button>
          <Button onClick={onDrawCarBox}>小轿车(yellow)</Button>
        </div>
        <div>
          <div ref={lidar} />
        </div>
      </div>
    </div>
  );
}
