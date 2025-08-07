export const createrCatelogEditor = ({ catelog, items, ifVisible }: { catelog: string, items: any[], ifVisible?: (e: any) => boolean }) => {
    return items.map(item => {
        return {
            catelog,
            ifVisible,
            ...item
        }
    });
};

export const templateRender = (template: string, params: any) => {
    return template.replace(/\$?{([^\{\}]*?)\}/g, (match, key) => {
      switch (key?.trim?.()) {
        case 'label':{
            return params?.label;
        }
        case '标题':{
          return params?.label?.replace(/(?=.)[:：]$/, '');
        }
        default:
          return `{${key}}`;
      }
    });
};

