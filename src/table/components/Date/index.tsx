/** @format */

import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { IColumn } from '../../types'
import copy from 'copy-to-clipboard';
import css from '../../runtime.less';
import moment from 'moment';

interface Props {
    value: any
    record: any
    columnItem: IColumn
    env: any
    templateMap?: Record<string, any>
}

const formatDate = (value: any, formatter: string) => {
    const val = moment(value).isValid() ? value : parseInt(value);
    return moment(val).format(formatter);
};

const DateRender = (props: Props): JSX.Element => {
    const { value, columnItem, env, templateMap } = props
    const { dateConfig = { formatter: 'Y-MM-DD' }, ellipsis } = columnItem;
    const { formatter } = dateConfig;
    const handleCopy = () => {
        try {
            copy(moment(value).valueOf().toString());  //复制时间戳
            message.success('日期时间戳复制成功');
        } catch {
            message.error('复制失败！');
        }
    }
    let date = moment().format(formatter);
    if (env.runtime) {
        if (typeof value == 'undefined')
            date = '';
        else {
            date = formatDate(value, formatter);
        }
    }
    if (templateMap) {
        date = columnItem.contentTemplate ?
            Object.keys(templateMap)
                .reduce((prev, next) => prev.replace(new RegExp('{' + next + '}', 'g'), formatDate(templateMap[next], formatter)), columnItem.contentTemplate)
            : '';
    }
    if (columnItem.isMapping && columnItem.mappingEnum) {
        date = columnItem.mappingEnum[templateMap ? date : value] || date;
    }
    return (
        columnItem.supportCopy ?
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={ellipsis && css.ellipsisWrap}>{date}</span>
                {columnItem.supportCopy && <span onClick={handleCopy} className={css.copyStyle} />}
            </div>
            :
            <span className={ellipsis && css.ellipsisWrap}>{date}</span>
    )
}

export default DateRender