
import { Data } from './types';

export default function ({
    data
}: UpgradeParams<Data>): boolean {

    //1.0.0 ->1.0.1
    data.items.forEach(item => {
        item.span = 24 / data.formItemColumn;
        if (!item.widthOption) {
            item.widthOption = 'span'
        }
    })

    return true;
}