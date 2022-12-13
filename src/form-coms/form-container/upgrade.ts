import { Data } from './types';
import { inputIds } from './constants'

export default function ({ data, input, output }: UpgradeParams<Data>): boolean {
    if (!input.get(inputIds.SET_INITIAL_VALUES)) {
        const schema = {
            "type": "object",
            "properties": {}
        };

        input.add(inputIds.SET_INITIAL_VALUES, '设置表单数据', schema);
    }

    if (input.get(inputIds.SET_FIELDS_VALUE)) {
        input.get(inputIds.SET_FIELDS_VALUE).setTitle('设置表单数据（触发值变化）')
    }

    //1.1.0 ->1.1.1
    if (!data.actions.widthOption) {
        data.actions.widthOption = 'span';
    }
    data.items.forEach(item => {
        if (!item.widthOption) {
            item.widthOption = 'span'
            item.span = 24 / data.formItemColumn;
        }
    })

    return true;
}