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

  const viewableHeight = 300; // 300px
  const itemHeight = 30;
  const dataHeight = dataList.length * 10; // 10px per item
  const itemCount = Math.ceil(viewableHeight / itemHeight); // 300px viewable height
  const startIndex = Math.floor(scrollTop / itemHeight); // 0
  const endIndex = startIndex + itemCount;
  const visibleData = dataList.slice(startIndex, endIndex); // 0-30
  const offset = scrollTop - (scrollTop % itemHeight); // 0

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
