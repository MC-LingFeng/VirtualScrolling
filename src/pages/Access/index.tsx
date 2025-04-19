import { useEffect, useRef, useState } from 'react';
import styles from './index.less';

// 模拟数据
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const dataList = new Array(1000).fill(0).map((_, index) => {
  return {
    id: index,
    name: `Item ${index} ${Array.from({ length: getRandomInt(20, 100) })
      .map(() => 'a')
      .join('')}`,
    height: getRandomInt(20, 100),
  };
});

// 预估高度
const estimatedHeight = 70;
interface CacheItem {
  index: number;
  height: number;
  top: number;
  bottom: number;
  id: number;
}
// let cache: CacheItem[] = []; // 缓存数据
const viewableHeight = 700; // 可视区域高度
const Optimization: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [dataHeight, setDataHeight] = useState(0);
  // const [cache]
  const cache = useRef<CacheItem[]>([]);

  const viewableRef = useRef<HTMLDivElement>(null);

  // const dataHeight = useRef<HTMLDivElement>(null); // 数据总高度
  const itemCount = Math.ceil(viewableHeight / estimatedHeight); // 可视区域内的项目数量
  const startIndex = useRef(0); // 起始索引
  const endIndex = useRef(itemCount); // 结束索引
  const visibleData = dataList.slice(startIndex.current, endIndex.current); // 可视数据
  const offset = useRef(0); // 偏移量

  const initPositionCache = () => {
    cache.current = dataList.map((item, index) => {
      return {
        index,
        id: item.id,
        height: estimatedHeight,
        top: index * estimatedHeight,
        bottom: (index + 1) * estimatedHeight,
      };
    });
  };

  const binarySearch = (list: CacheItem[], value: number) => {
    let start = 0;
    let end = list.length - 1;
    let tempIndex = null;
    while (start <= end) {
      let midIndex = parseInt((start + end) / 2);
      console.log(midIndex);

      let midValue = list[midIndex].bottom;
      if (midValue === value) {
        return midIndex + 1;
      } else if (midValue < value) {
        start = midIndex + 1;
      } else if (midValue > value) {
        if (tempIndex === null || tempIndex > midIndex) {
          tempIndex = midIndex;
        }
        end = end - 1;
      }
    }
    return tempIndex;
  };
  const getStartIndex = (scrollTop = 0) => {
    return binarySearch(cache.current, scrollTop);
  };
  const updateItemsSize = () => {
    // 更新缓存数据
    viewableRef.current?.childNodes?.forEach((item) => {
      const dom = item as HTMLDivElement;
      const height = dom.offsetHeight;
      console.log(height, dom.offsetHeight, dom.scrollHeight);

      const id = parseInt(dom.id);
      const cacheItem = cache.current.find((i) => i.id === id) as CacheItem;

      const cacheIndex = cache.current.findIndex((i) => i.id === id) as number;
      const dValue = cacheItem.height - height;
      if (dValue) {
        cache.current[cacheIndex].bottom -= dValue;
        cache.current[cacheIndex].height = height;
      }

      for (let i = cacheIndex + 1; i < cache.current.length; i++) {
        cache.current[i].top = cache.current[i - 1].bottom;
        cache.current[i].bottom -= dValue;
      }
    });
  };

  const setStartOffset = () => {
    // 设置起始偏移量
    // const startId = parseInt((viewableRef.current?.childNodes?.[0] as HTMLDivElement)?.id ?? 0);
    offset.current =
      startIndex.current >= 1 ? cache.current[startIndex.current].bottom : 0;
  };

  // const getCountHeights = (start: number, end: number) => {

  // }

  useEffect(() => {
    initPositionCache();
    const container = document.querySelector(`.${styles.container}`);
    if (container) {
      container.addEventListener('scroll', (e) => {
        const target = e.target as HTMLDivElement;
        const start = getStartIndex(target.scrollTop) ?? 0;

        startIndex.current = start;
        endIndex.current = start + itemCount;
        setStartOffset();
        setScrollTop(target.scrollTop);
      });
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (
        !viewableRef.current?.childNodes ||
        !viewableRef.current?.childNodes.length
      ) {
        return;
      }
      updateItemsSize();
      setDataHeight(cache.current[cache.current.length - 1].bottom);

      setStartOffset();
    });
  }, [scrollTop]);

  return (
    <div style={{ height: 700 }}>
      <div className={styles.container}>
        <div className={styles.dataHeight} style={{ height: dataHeight }}></div>
        <div
          className={styles.viewable}
          ref={viewableRef}
          style={{ height: 700 }}
        >
          {visibleData.map((item) => {
            return (
              <div
                key={item.id}
                id={item.id.toString()}
                className={styles.infiniteItem}
                style={{
                  transform: `translate3d(0,${offset.current}px,0)`,
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Optimization;
