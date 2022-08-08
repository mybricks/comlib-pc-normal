type ColumnInnerJustifyType =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-around'
  | 'space-between';

export const SlotLayoutEditor = (mySlot) => [
  {
    title: '内容布局',
    type: 'Select',
    options: [
      { value: 'flex-row', label: '水平排列' },
      { value: 'flex-column', label: '垂直排列' }
    ],
    value: {
      get() {
        if (!mySlot.getLayout()) mySlot.setLayout('flex-column');
        return mySlot.getLayout();
      },
      set({}, value) {
        return mySlot.setLayout(value);
      }
    }
  },
  {
    title: '水平对齐',
    type: 'Select',
    options: [
      { value: 'flex-start', label: '居左' },
      { value: 'center', label: '居中' },
      { value: 'flex-end', label: '居右' },
      { value: 'space-around', label: '均匀排列' },
      { value: 'space-between', label: '两端对齐' }
    ],
    ifVisible(): undefined | boolean {
      return mySlot.getLayout() === 'flex-row';
    },
    value: {
      get() {
        return mySlot?.getJustifyContent();
      },
      set({}, value: ColumnInnerJustifyType) {
        mySlot.setJustifyContent(value);
      }
    }
  },
  {
    title: '垂直对齐',
    type: 'Select',
    options: [
      { value: 'flex-start', label: '居上' },
      { value: 'center', label: '居中' },
      { value: 'flex-end', label: '居下' }
    ],
    ifVisible({}): undefined | boolean {
      return mySlot.getLayout() === 'flex-row';
    },
    value: {
      get() {
        return mySlot?.getAlignItems();
      },
      set({}, value: ColumnInnerJustifyType) {
        mySlot.setAlignItems(value);
      }
    }
  },
  {
    title: '水平对齐',
    type: 'Select',
    options: [
      { value: 'flex-start', label: '居左' },
      { value: 'center', label: '居中' },
      { value: 'flex-end', label: '居右' }
    ],
    ifVisible({}): undefined | boolean {
      return mySlot.getLayout() === 'flex-column';
    },
    value: {
      get({}) {
        return mySlot?.getAlignItems();
      },
      set({}, value: ColumnInnerJustifyType) {
        mySlot.setAlignItems(value);
      }
    }
  },
  {
    title: '垂直对齐',
    type: 'Select',
    options: [
      { value: 'flex-start', label: '居上' },
      { value: 'center', label: '居中' },
      { value: 'flex-end', label: '居下' },
      { value: 'space-around', label: '均匀排列' },
      { value: 'space-between', label: '两端对齐' }
    ],
    ifVisible({}): undefined | boolean {
      return mySlot.getLayout() === 'flex-column';
    },
    value: {
      get({}) {
        return mySlot?.getJustifyContent();
      },
      set({}, value: ColumnInnerJustifyType) {
        mySlot.setJustifyContent(value);
      }
    }
  }
];
