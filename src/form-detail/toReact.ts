import { DescriptionsProps, TooltipProps } from "antd";
import { getPropsFromObject, getClsStyle } from "../utils/toReact";
import { Data, Item, TypeEnum } from "./constants";

// less样式
const allCls = {
    vertical: {
        // :global {
        //   .ant-descriptions-item-container {
        //     display: flex;
        //     flex-direction: column;
        //   }
        // }
    },
    des: {
    },
    ellipsisTooltip: {
        maxWidth: '400px',
        maxHeight: '480px',
    },
    suffixBtn: {
        margin: '0 10px',
        flexShrink: 0
    },
    pre: {
        whiteSpace: 'pre-wrap'
    }
};
const css = {
    vertical: 'vertical',
    des: 'des',
    ellipsisTooltip: 'ellipsisTooltip',
    suffixBtn: 'suffixBtn',
    pre: 'pre'
};

export default function ({ data, slots }: RuntimeParams<Data>) {

    // mock数据源
    const getDataSource = () => {
        const res: Item[] = [];
        let ds = {};
        (data.items || []).forEach((item) => {
            const customLabelStyle = {
                ...item.labelStyle
            };
            if (customLabelStyle.letterSpacing === 0) delete customLabelStyle.letterSpacing;
            if (customLabelStyle.fontWeight === 'normal') delete customLabelStyle.fontWeight;
            if (customLabelStyle.fontSize === 14) delete customLabelStyle.fontSize;
            const labelStyle = {
                ...customLabelStyle,
                marginLeft: item.stylePadding ? item.stylePadding[0] : void 0
            };
            const customContentStyle = {
                ...item.contentStyle
            };
            if (customContentStyle.letterSpacing === 0) delete customContentStyle.letterSpacing;
            if (customContentStyle.fontWeight === 'normal') delete customContentStyle.fontWeight;
            if (customContentStyle.fontSize === 14) delete customContentStyle.fontSize;
            const contentStyle = {
                ...customContentStyle,
                color: item.color || item.contentStyle?.color,
                marginTop: item.stylePadding ? item.stylePadding[1] : void 0
            };

            const itemStyle = {
                paddingLeft: Array.isArray(item.padding) ? item.padding[0] || void 0 : void 0,
                paddingRight: Array.isArray(item.padding) ? item.padding[1] || void 0 : void 0,
                paddingTop: Array.isArray(item.padding) ? item.padding[2] || void 0 : void 0,
                paddingBottom: Array.isArray(item.padding) ? item.padding[3] || void 0 : void 0
            };

            res.push({
                ...item,
                value: ds[item.key] === void 0 ? item.value : ds[item.key],
                labelStyle,
                contentStyle,
                itemStyle
            });
        });
        return res;
    };

    const str = getDescriptionsStr({ data, slots }, getDataSource());

    return {
        imports: [
            {
                from: 'antd',
                coms: ['Descriptions', 'Tooltip']
            },
            {
                from: 'antd/dist/antd.css',
                coms: []
            },
        ],
        jsx: str,
        style: '',
        js: ''
    }
}

/**
 * 获取描述列表codeStr
 * @param env 
 */
const getDescriptionsStr = ({ data, slots }: { data: Data, slots: any }, ds: Item[]) => {
    const { showTitle, title, size, layout, column, bordered, colon } = data;

    const defaultDescriptionProps: DescriptionsProps = {
        size: 'default',
        layout: 'horizontal',
        column: 3,
        bordered: false,
        colon: true,
    }
    const descriptionsProps: DescriptionsProps = {
        title: showTitle ? title : void 0,
        size,
        layout,
        column,
        bordered,
        colon,
        style: getClsStyle(allCls, [css.des])
    };

    return `<Descriptions
                ${getPropsFromObject(descriptionsProps, defaultDescriptionProps)}
            >
            ${ds.map(item => getDescriptionsItemStr(item, slots)).join('\n')}
            </Descriptions>`
}

/**
 * 获取描述项codeStr
 * @param item 描述项
 */
const getDescriptionsItemStr = (item: Item, slots) => {
    const {
        value,
        type,
        span,
        label,
        labelStyle,
        contentStyle,
        itemStyle,
        slotId = '',
        rows,
        maxWidth,
        ellipsis,
        showLabel = true
    } = item || {};

    const SlotItem = type === TypeEnum.AllSlot || type === TypeEnum.PartSlot
        ? slots[slotId]?.render()
        : null;
    const getTextItem = () => {
        const multiLine = {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: maxWidth,
            display: '-webkit-box',
            WebkitLineClamp: rows,
            WebkitBoxOrient: 'vertical',
            wordWrap: 'break-word',
            wordBreak: 'normal'
        };
        const singleLine = {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: maxWidth,
            border: 'none'
        };
        const customStyle = rows === 1 ? singleLine : multiLine;
        const divProps = {
            style: { ...getClsStyle(allCls, [css.pre]), width: maxWidth ? maxWidth + 'px' : void 0 }
        }
        return ellipsis ? getMassiveValue({ value, customStyle, ellipsis }) :
            `<div ${getPropsFromObject(divProps)}>
                ${value}
            < /div>`
    }
    const desItemProps = {
        label: showLabel ? label : void 0,
        span,
        labelStyle,
        contentStyle,
        style: itemStyle
    };
    const defaultdesItemProps = {
        span: 1,
        labelStyle: {
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '22px',
            color: 'rgba(0,0,0,0.45)',
            letterSpacing: 0,
            marginLeft: 0,
        },
        contentStyle: {
            fontSize: 14,
            fontWeight: "normal",
            lineHeight: '22px',
            color: 'rgba(0,0,0,0.88)',
            letterSpacing: 0,
            marginTop: 0,
        }
    }
    switch (type) {
        case TypeEnum.AllSlot:
            return `<Descriptions.Item span={${span}}>
                        ${SlotItem}
                    </Descriptions.Item>`;
        case TypeEnum.PartSlot:
            return `<Descriptions.Item
                        ${getPropsFromObject(desItemProps, defaultdesItemProps)}
                    >
                        ${SlotItem}
                    </Descriptions.Item>`;
        default:
            return `<Descriptions.Item
                    ${getPropsFromObject(desItemProps, defaultdesItemProps)}
                    >
                    ${getTextItem()}
                    </Descriptions.Item>`
    }
}

// 超出内容省略
const getMassiveValue = ({ value, customStyle, ellipsis }) => {
    const outerDivProps = {
        style: customStyle
    }
    const tooltipProps: TooltipProps = {
        title: value,
        overlayStyle: getClsStyle(allCls, [css.ellipsisTooltip]),
        color: '#fff'
    };
    const innerDivProps = {
        style: getClsStyle(allCls, [css.pre])
    };

    return `<div ${getPropsFromObject(outerDivProps)} >
                <Tooltip ${getPropsFromObject(tooltipProps)} >
                    <div ${getPropsFromObject(innerDivProps)} > ${value} < /div>
                < /Tooltip>
            </div>`
}