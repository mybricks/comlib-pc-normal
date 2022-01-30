import { FormItemProps } from '../runtime';
// import {
//   OUTPUT,
//   GET_FIELD_VALUE,
//   GET_FORM_ITEM,
//   SET_FORM_PARAMS,
//   VALIDATOR_VALUE_KEY,
//   FOFM_ITEMS_KEY
// } from '../blocks/constants';

export interface ValidatorResultProps {
  code: number;
  msg: string;
}

interface ScratchConfigProps {
  formItem: FormItemProps;
  blocksOri: any;
  formItems: FormItemProps[];
}

// function getRulesEvalScript(formItem: FormItemProps) {
//   const { key } = formItem;
//   let script = decodeURIComponent(
//     formItem.blocksValidator && (formItem.blocksValidator.script || '')
//   );
//   const reg = new RegExp(`${key}\\(\\(${key},_output\\)=>{`);

//   // .replaceAll('\\n', '')
//   script = script
//     .trim()
//     .replace(reg, '')
//     // .replace(/(_debugLog\().+("\]\))/g, '')
//     .replace(/}\)$/, '')
//     .replace(/_output_/g, '_formres_');

//   const evalScript = `
//     (function(
//       ${VALIDATOR_VALUE_KEY},
//       ${FOFM_ITEMS_KEY},
//       {${GET_FIELD_VALUE}, ${SET_FORM_PARAMS}},
//       ${OUTPUT},
//       _formres_
//     ) {
//       try {
//         ${script}
//       } catch(ex) {
//         console.error(ex)
//       }
//     })
//   `;
//   // console.log('debug-form', evalScript);
//   return evalScript;
// }

function getValidatorScratchConfig({
  formItem,
  blocksOri,
  formItems
}: ScratchConfigProps) {
  return [
    {
      id: formItem.key,
      title: '校验输入',
      input: formItem.name,
      outputs: [],
      vars: blocksOri ? blocksOri.vars : void 0,
      xml: blocksOri ? blocksOri.xml : void 0,
      script: blocksOri ? encodeURIComponent(blocksOri.script) : void 0,
      formItems: formItems,
      currentItem: formItem
    }
  ];
}

export { getValidatorScratchConfig };
