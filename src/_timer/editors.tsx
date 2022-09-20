import { uuid } from '../utils';
import {
  ActionType,
  ActionTypeMap,
  Data,
  OUTPUT_ID_TRIGGER,
  stopTimer,
  TimerType,
  TimerTypeMap
} from './constants';

const setDescByData = ({ data, setDesc }: { data: Data; setDesc }) => {
  const { actionType, timerType, id, stopId } = data;
  const info = [];
  if (actionType === ActionType.START) {
    info.push(`行为：${TimerTypeMap[timerType]}`);
    if (timerType === TimerType.TIMEOUT || timerType === TimerType.INTERVAL) {
      info.push(`定时器ID：${id}`);
    }
  }
  if (actionType === ActionType.END) {
    info.push(`行为：${ActionTypeMap[actionType]}`);
    if (stopId) {
      info.push(`目标ID：${stopId}`);
    }
  }

  setDesc(info.join('\n'));
};

// 新增定时器
const addTimer = ({ output }) => {
  output.add(OUTPUT_ID_TRIGGER, '执行', {
    type: 'any'
  });
};
// 移除定时器
const removeTimer = ({ data, output }: { data: Data; output }) => {
  stopTimer(data.id);
  output.remove(OUTPUT_ID_TRIGGER);
};

export default {
  '@init': ({ data, setDesc }: EditorResult<Data>) => {
    data.id = uuid();
    setDescByData({ data, setDesc });
  },
  ':root': [
    {
      title: '触发配置',
      ifVisible: ({ data }: EditorResult<Data>) => {
        return data.actionType === ActionType.START;
      },
      items: [
        {
          title: '定时器类型',
          type: 'select',
          options: [
            {
              label: TimerTypeMap[TimerType.INTERVAL],
              value: TimerType.INTERVAL
            },
            {
              label: TimerTypeMap[TimerType.TIMEOUT],
              value: TimerType.TIMEOUT
            },
            {
              label: TimerTypeMap[TimerType.DEBOUNCE],
              value: TimerType.DEBOUNCE
            },
            {
              label: TimerTypeMap[TimerType.THROTTLE],
              value: TimerType.THROTTLE
            }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.timerType;
            },
            set({ data, setDesc }: EditorResult<Data>, value: TimerType) {
              data.timerType = value;
              setDescByData({ data, setDesc });
            }
          }
        },
        {
          title: '轮询/延迟/防抖/节流时间（ms）',
          type: 'text',
          options: {
            type: 'number'
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.delay;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.delay = parseInt(`${value}`, 10) || 0;
            }
          }
        }
      ]
    },
    {
      itle: '行为配置',
      ifVisible({ data }: EditorResult<Data>) {
        return [TimerType.INTERVAL, TimerType.TIMEOUT].includes(data.timerType);
      },
      items: [
        {
          title: '行为类型',
          type: 'select',
          options: [
            { label: ActionTypeMap[ActionType.START], value: ActionType.START },
            { label: ActionTypeMap[ActionType.END], value: ActionType.END }
          ],
          value: {
            get({ data }: EditorResult<Data>) {
              return data.actionType;
            },
            set({ data, output, setDesc }: EditorResult<Data>, value: ActionType) {
              if (value === ActionType.END) {
                removeTimer({ data, output });
              } else {
                addTimer({ output });
              }
              data.actionType = value;
              setDescByData({ data, setDesc });
            }
          }
        },
        {
          title: '定时器ID',
          type: 'text',
          ifVisible({ data }: EditorResult<Data>) {
            return data.actionType === ActionType.START;
          },
          options: {
            disabled: true
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.id;
            },
            set({ data }: EditorResult<Data>, value: string) {
              data.id = value;
            }
          }
        },
        {
          title: '停止定时器ID',
          type: 'text',
          ifVisible: ({ data }: EditorResult<Data>) => {
            return data.actionType === ActionType.END;
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.stopId;
            },
            set({ data, setDesc }: EditorResult<Data>, value: string) {
              data.stopId = value;
              setDescByData({ data, setDesc });
            }
          }
        }
      ]
    }
  ]
};
