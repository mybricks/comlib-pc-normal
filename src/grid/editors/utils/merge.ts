import { WidthUnitEnum, Data } from '../../constants';
import { getColIndex, getColItem, updateCol } from './common';
/**
 * 1，同类型布局列支持合并
 * 2，flex布局列可以和任何布局类型合并
 */

const mergeStrategy = {
    [WidthUnitEnum.Auto]: ({ data, focusArea, slot }: EditorResult<Data>) => {
        const [rowIndex, colIndex] = getColIndex(data, focusArea);
        const row = data.rows[rowIndex];
        const currentCol = row.columns[colIndex];
        const nextCol = row.columns[colIndex + 1];
        if (nextCol.widthOption === WidthUnitEnum.Auto) {
            currentCol.flex = currentCol.flex + nextCol.flex
        }
        slot.remove(nextCol?.slot);
        data.rows[rowIndex].columns.splice(colIndex + 1, 1);
        // updateCol(row, slot);
    },
    [WidthUnitEnum.Px]: ({ data, focusArea, slot }: EditorResult<Data>) => {
        const [rowIndex, colIndex] = getColIndex(data, focusArea);
        const row = data.rows[rowIndex];
        const currentCol = row.columns[colIndex];
        const nextCol = row.columns[colIndex + 1];
        currentCol.width = currentCol.width + nextCol.width
        slot.remove(nextCol?.slot);
        data.rows[rowIndex].columns.splice(colIndex + 1, 1);
        updateCol(row, slot);
    },
    [WidthUnitEnum.Span]: ({ data, focusArea, slot }: EditorResult<Data>) => {
        const [rowIndex, colIndex] = getColIndex(data, focusArea);
        const row = data.rows[rowIndex];
        const currentCol = row.columns[colIndex];
        const nextCol = row.columns[colIndex + 1];
        currentCol.span = currentCol.span + nextCol.span
        slot.remove(nextCol?.slot);
        data.rows[rowIndex].columns.splice(colIndex + 1, 1);
        updateCol(row, slot);
    }
};

export const canMerge = ({ data, focusArea }: EditorResult<Data>): boolean => {
    const [rowIndex, colIndex] = getColIndex(data, focusArea)
    const currentCol = data.rows[rowIndex].columns[colIndex]
    const nextCol = data.rows[rowIndex].columns[colIndex + 1]
    if (!currentCol || !nextCol) return false //最后一列
    if (currentCol.widthOption === WidthUnitEnum.Auto) return true  //自适应列可以跟任何列合并
    if (currentCol.widthOption === WidthUnitEnum.Px || currentCol.widthOption === WidthUnitEnum.Span) {
        //相同布局类型列支持合并
        if (currentCol.widthOption === nextCol.widthOption) {
            return true
        }
    }
    return false
}

export const mergeCol = ({ data, focusArea, slot }: EditorResult<Data>) => {
    if (!focusArea) return;
    const item = getColItem(data, focusArea);
    mergeStrategy[item.widthOption]({ data, focusArea, slot });
}