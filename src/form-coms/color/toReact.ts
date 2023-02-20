import { Data } from './runtime';

export default function ({ data }: RuntimeParams<Data>) {
    const str = `<div style={{ width :  '${data.width}'}}>
                  <div
                    style={{ 
                      height: '32px',
                      border: '5px solid #f7f7f7',
                      width: '${data.width}',
                      backgroundColor: '${data.color}',
                      ${data.disabled ? `cursor: 'not-allowed' `: ''}
                     }}
                  >
                     <div
                      style={{
                        height: '22px',
                        ${data.disabled ? `backgroundColor: 'hsla(0,0%,100%,.8)' `: ''}
                      }}
                     ></div>
                  </div>
                </div>`

    return {
        imports: [
            {
                from: 'antd/dist/antd.css',
                coms: []
            }
        ],
        jsx: str,
        style: '',
        js: ''
    }
}