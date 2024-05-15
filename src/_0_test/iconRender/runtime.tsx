import * as Icons from '@ant-design/icons';

export default function ({env, data, inputs, outputs}) {

  // const btnItemR = useCallback(
  //   ({ icon }: { icon: any }) => {
  //     console.log(Icons, icon)
  //     const Icon = Icons && Icons[icon as string]?.render();
  //     if (typeof Icon === 'undefined') {
  //       return <div dangerouslySetInnerHTML={{ __html: icon }} />;
  //     } else {
  //       return <>{Icon}</>;
  //     }
  //   },
  //   [data.icon]
  // );
  return (
    <div style={{fontSize: '20px'}}>
      {Icons['HomeOutlined']?.render()}
      {/* {btnItemR({ icon: 'HomeOutlined' })} */}
    </div>
  )
}