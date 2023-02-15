import moment, { Moment } from "moment";
import { TimeDateLimitItem } from "../types";
import { Data } from "./runtime";

export const getDisabledDateTime = ({ data, dates }: { data: Data, dates }) => {
    const { useDisabledDate, useDisabledTime, staticDisabledDate, staticDisabledTime } = data;

    const getLimitByDateType = ({
        limitItem,
        baseDate,
        defaultType
    }: {
        limitItem: TimeDateLimitItem;
        baseDate?: Moment | null;
        defaultType: 'days' | 'seconds';
    }) => {
        const { type, offset, direction } = limitItem;
        if (type !== 'custom') {
            return direction === 'before'
                ? moment().add(offset, type).startOf(type)
                : moment().add(offset, type).endOf(type);
        } else if (!!baseDate) {
            return direction === 'before'
                ? moment(baseDate).add(offset, defaultType).startOf(defaultType)
                : moment(baseDate).add(offset, defaultType).endOf(defaultType);
        }
        return [];
    };
    const range = (start: number, end: number): number[] => {
        const result: number[] = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const formatter = (m, template?) => moment(m).format(template || 'Y-MM-DD');

    // 日期禁用数据
    const startDateLimit = staticDisabledDate[0];
    const endDateLimit = staticDisabledDate[1];
    const startDate = getLimitByDateType({ limitItem: startDateLimit, defaultType: 'days' });
    const endDate = getLimitByDateType({
        limitItem: endDateLimit,
        defaultType: 'days',
        baseDate: dates?.[0]
    });
    const useStartDateLimit = useDisabledDate === 'static' && startDateLimit.checked;
    const useEndDateLimit = useDisabledDate === 'static' && endDateLimit.checked && dates?.[0];

    /** 日期禁用函数 */
    const disabledDate = (current) => {
        // current: 所有日期
        let startBool = false,
            endBool = false;

        if (useStartDateLimit) {
            if (startDateLimit.direction === 'before') {
                if (current && current < startDate) {
                    startBool = true;
                }
            }
            if (startDateLimit.direction === 'after') {
                if (current && current > startDate) {
                    startBool = true;
                }
            }
        }
        if (useEndDateLimit) {
            if (endDateLimit.direction === 'before') {
                if (current && current < endDate) {
                    endBool = true;
                }
            }
            if (endDateLimit.direction === 'after') {
                if (current && current > endDate) {
                    endBool = true;
                }
            }
        }
        return startBool || endBool;
    };

    // 时间禁用数据
    const startTimeLimit = staticDisabledTime[0];
    const endTimeLimit = staticDisabledTime[1];
    const startTime = getLimitByDateType({ limitItem: startTimeLimit, defaultType: 'seconds' });
    const endTime = getLimitByDateType({
        limitItem: endTimeLimit,
        defaultType: 'seconds',
        baseDate: dates?.[0]
    });
    const useStartTimeLimit = data.showTime && useDisabledTime === 'static' && startTimeLimit.checked;
    const useEndTimeLimit = data.showTime && useDisabledTime === 'static' && endTimeLimit.checked && dates?.[0];

    /** 时间禁用函数----待完善，目前不支持固定范围---- */
    const disabledTime =
        useDisabledTime === 'static' && data.showTime
            ? (current) => {
                let hours = moment().hours(),
                    minutes = moment().minutes(),
                    seconds = moment().seconds();
                const limitDate = useStartDateLimit ? startDate : false;
                if (useEndTimeLimit && endTimeLimit.type === 'custom') {
                    hours = moment(dates[0]).hours();
                    minutes = moment(dates[0]).minutes();
                    seconds = moment(dates[0]).seconds();
                }
                if (!limitDate || (current && formatter(startDate) == formatter(current))) {
                    return {
                        disabledHours: () => range(0, hours),
                        disabledMinutes: (selectedHour) => (selectedHour <= hours ? range(0, minutes) : []),
                        disabledSeconds: (selectedHour, selectedMinute) =>
                            selectedHour <= hours && selectedMinute <= minutes ? range(0, seconds) : []
                    };
                }
                return {
                    disabledHours: () => [],
                    disabledMinutes: () => [],
                    disabledSeconds: () => []
                };
            }
            : void 0;
    return {
        disabledDate,
        disabledTime
    };
}