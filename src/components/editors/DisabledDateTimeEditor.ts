import { PickerComponentType, DateType, TimeDateLimitItem } from "../../form-coms/types";

const baseDateOptions = [
    { label: "当前年", value: DateType.Year },
    { label: "当前月", value: DateType.Month },
    { label: "当前周", value: DateType.Week },
    { label: "当前天", value: DateType.Day },
];
const baseTimeOptions = [
    { label: "当前时", value: DateType.Hour },
    { label: "当前分", value: DateType.Minute },
    { label: "当前秒", value: DateType.Second },
];
const initDateRules: TimeDateLimitItem[] = [
    {
        title: '起始日期禁选',
        checked: true,
        type: DateType.Day as DateType,
        offset: 0,
        direction: 'before'
    },
    {
        title: '结束日期禁选',
        checked: true,
        type: DateType.Custom as DateType,
        offset: 0,
        direction: 'before'
    }
];
const initTimeRules: TimeDateLimitItem[] = [
    {
        title: '起始时间禁选',
        checked: true,
        type: DateType.Second as DateType,
        offset: 0,
        direction: 'before'
    },
    {
        title: '结束时间禁选',
        checked: true,
        type: DateType.Custom as DateType,
        offset: 0,
        direction: 'before'
    }
];

export const DisabledDateTimeEditor = (componentType: PickerComponentType) => [
    {
        title: "日期禁选",
        type: "Select",
        description: '选中“无”时的默认限制：结束日期小于开始日期',
        options: [
            {
                label: '无',
                value: 'default'
            },
            {
                label: '静态配置',
                value: 'static'
            },
        ],
        value: {
            get({ data }) {
                if (!data.useDisabledDate)
                    data.useDisabledDate = 'default';
                return data.useDisabledDate;
            },
            set({ data }, value: string) {
                data.useDisabledDate = value;
            },
        },
    },
    {
        ifVisible({ data }: EditorResult<any>) {
            return data.useDisabledDate === 'static';
        },
        type: "ArrayCheckbox",
        options: {
            checkField: 'checked',
            deletable: false,
            addable: false,
            getTitle: (item, index: number) => {
                const { title, type, offset, direction } = item;
                const titleText = title + ': ';
                const typeText = baseDateOptions.find(item => item.value === type)?.label || '起始日期';
                const offsetText = offset === 0 ? '' : (offset > 0 ? '+' + offset : offset);
                const directionText = ({
                    before: '之前',
                    after: '之后',
                })[direction];
                return titleText + typeText + offsetText + directionText;
            },
            items: [
                {
                    title: "基准日期",
                    type: "Select",
                    value: "type",
                    ifVisible(item) {
                        return item.title === '起始日期禁用';
                    },
                    options: baseDateOptions,
                },
                {
                    title: "基准日期",
                    type: "Select",
                    value: "type",
                    ifVisible(item) {
                        return item.title === '结束日期禁用';
                    },
                    options: [
                        { label: "起始日期", value: DateType.Custom },
                        ...baseDateOptions
                    ],
                },
                {
                    title: "偏移",
                    type: "InputNumber",
                    value: "offset",
                    options: [
                        { min: -1000, max: 1000 },
                    ],
                },
                {
                    title: "方向",
                    type: "Select",
                    value: "direction",
                    options: [
                        { label: "之前", value: 'before' },
                        { label: "之后", value: 'after' },
                    ],
                },
            ],
        },
        value: {
            get({ data }) {
                if (!data.staticDisabledDate) data.staticDisabledDate = initDateRules;
                return data.staticDisabledDate;
            },
            set({ data }, value: TimeDateLimitItem[]) {
                data.staticDisabledDate = value;
            },
        },
    },
    {
        title: "时间禁选",
        type: "Select",
        description: '默认无限制',
        ifVisible({ data }: EditorResult<any>) {
            return !!data.showTime;
        },
        options: [
            {
                label: '无',
                value: 'default'
            },
            {
                label: '静态配置',
                value: 'static'
            },
        ],
        value: {
            get({ data }) {
                if (!data.useDisabledTime)
                    data.useDisabledTime = 'default';
                return data.useDisabledTime;
            },
            set({ data }, value: string) {
                data.useDisabledTime = value;
            },
        },
    },
    {
        ifVisible({ data }: EditorResult<any>) {
            return data.useDisabledTime === 'static' && !!data.showTime;
        },
        type: "ArrayCheckbox",
        options: {
            checkField: 'checked',
            deletable: false,
            addable: false,
            getTitle: (item, index: number) => {
                const { title, type, offset, direction } = item;
                const titleText = title + ': ';
                const typeText = baseTimeOptions.find(item => item.value === type)?.label || '起始时间';
                const offsetText = offset === 0 ? '' : (offset > 0 ? '+' + offset : offset);
                const directionText = ({
                    before: '之前',
                    after: '之后',
                })[direction];
                return titleText + typeText + offsetText + directionText;
            },
            items: [
                {
                    title: "基准时间",
                    type: "Select",
                    value: "type",
                    ifVisible(item) {
                        return item.title === '起始时间禁用';
                    },
                    options: baseTimeOptions,
                },
                {
                    title: "基准时间",
                    type: "Select",
                    value: "type",
                    ifVisible(item) {
                        return item.title === '结束时间禁用';
                    },
                    options: [
                        { label: "起始时间", value: DateType.Custom },
                        ...baseTimeOptions
                    ],
                },
                {
                    title: "偏移",
                    type: "InputNumber",
                    value: "offset",
                    options: [
                        { min: -1000, max: 1000 },
                    ],
                },
                {
                    title: "方向",
                    type: "Select",
                    value: "direction",
                    options: [
                        { label: "之前", value: 'before' },
                        { label: "之后", value: 'after' },
                    ],
                },
            ],
        },
        value: {
            get({ data }) {
                if (!data.staticDisabledTime) data.staticDisabledTime = initTimeRules;
                return data.staticDisabledTime;
            },
            set({ data }, value: TimeDateLimitItem[]) {
                data.staticDisabledTime = value;
            },
        },
    },
];
