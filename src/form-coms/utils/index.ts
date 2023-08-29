export const createrCatelogEditor = ({ catelog, items, ifVisible }: { catelog: string, items: any[], ifVisible?: (e: any) => boolean }) => {
    return items.map(item => {
        return {
            catelog,
            ifVisible,
            ...item
        }
    });
};