function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
const strMapToJson = (strMap) => {
  return JSON.stringify(strMapToObj(strMap));
};

export enum LabelType {
  CAR = 'car', // 小汽车
  TRANK = 'trank', // 大卡车
}

export interface BoxItem {
  color: string; // 颜色
  type: LabelType; // 标签 小汽车 or 大卡车
  position: THREE.Vector3; // 坐标
  size: THREE.Vector3; // 长宽高
}

export const downLoadAsJson = (data: Map<string, BoxItem>) => {
  const json = strMapToJson(data);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const tag = document.createElement('a');
  tag.href = url;
  tag.download = '车辆标注信息.json';
  tag.click();
  URL.revokeObjectURL(url);
};
