import React from 'react';

interface Iprops {
  value?: any;
  onChange?: (value: any) => void;
  formContext: any;
  formItem: any;
}

// install是为了兼容老的inputs
const inputKeys = ['install', 'slotProps'];

export default function TextControl({
  onChange,
  formItem,
  formContext,
}: Iprops) {

  const SlotFormItem =
    formItem?.slotId && formContext.slots[formItem?.slotId]?.render;
  if (!SlotFormItem) {
    return;
  }

  inputKeys.forEach(key => {
    formItem[`fz_${key}`]?.()
  })

  return (
    <SlotFormItem
      inputs={{
        ...inputKeys.reduce((obj, key) => {
          obj[key]= (fn) => {
            (formItem as any)[`fz_${key}`] = () => {
              const formRef = formContext.formRef.current;
              const { name, disabled } = formItem;
              fn({
                value: formRef?.getFieldValue(name),
                formProps: {
                  disabled
                },
                formRef
              });
            };
            (formItem as any)[`fz_${key}`]();
          }
          return obj;
        }, {})
      }}
      outputs={onChange}
    />
  );
}
