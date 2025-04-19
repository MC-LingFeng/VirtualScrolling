import { useEffect, useState } from 'react';
import styles from './index.less';

const dataList = new Array(1000).fill(0).map((_, index) => {
  return {
    id: index,
    name: `Item ${index}`,
  };
});

const HomePage: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  const viewableHeight = 300; // 可视区域高度
  const itemHeight = 30; // 单个项目高度
  const dataHeight = dataList.length * itemHeight; // 数据总高度
  const itemCount = Math.ceil(viewableHeight / itemHeight); // 可视区域内的项目数量
  const startIndex = Math.floor(scrollTop / itemHeight); // 起始索引
  const endIndex = startIndex + itemCount; // 结束索引
  const visibleData = dataList.slice(startIndex, endIndex); // 可视数据
  const offset = scrollTop - (scrollTop % itemHeight); // 偏移量

  useEffect(() => {
    const container = document.querySelector(`.${styles.container}`);
    if (container) {
      container.addEventListener('scroll', (e) => {
        const target = e.target as HTMLDivElement;

        setScrollTop(target.scrollTop);
        // console.log(scrollTop, '---scrollTop2');
      });
    }
    return () => {
      // scrollTop.current = 0;
    };
  }, []);

  return (
    <div>
      <h1>虚拟滚动</h1>
      <span>存在问题： 1. 高度固定 2. 白屏闪烁</span>
      <div className={styles.container} style={{ height: viewableHeight }}>
        <div className={styles.dataHeight} style={{ height: dataHeight }}></div>
        <div className={styles.viewable} style={{ height: viewableHeight }}>
          {visibleData.map((item) => {
            return (
              <div
                key={item.id}
                className={styles.item}
                style={{
                  height: itemHeight,
                  transform: `translateY(${offset}px)`,
                  textAlign: 'center',
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

export default HomePage;
