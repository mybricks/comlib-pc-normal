import React, { useState, useRef, useEffect, useMemo } from 'react';
import { message, Space, Tag, Input, InputRef } from 'antd';
import * as Icons from '@ant-design/icons';
import { Data, Tag as TagType } from './types';
import { uuid, createTag } from './editor/util';
import styles from './style.less';

export default function ({ env, data, inputs, outputs, slots }: RuntimeParams<Data>) {
  const { checkable } = data;

  inputs.dynamicTags &&
    inputs.dynamicTags((val: Array<TagType>, relOutputs) => {
      if (!Array.isArray(val)) {
        message.error('请输入列表数据');
        return;
      }
      data.tags = val.map((item) => {
        if (!item.key) {
          item.key = uuid();
        }
        if (!item.color) {
          item.color = data.type ?? 'default';
        }
        return item;
      });
      relOutputs.dynamicComplete();
    });

  inputs.getTags &&
    inputs.getTags((_, relOutputs) => {
      relOutputs.outputTags(data.tags);
    });

  return checkable ? (
    <CheckTag data={data} outputs={outputs} inputs={inputs} env={env} />
  ) : (
    <DefaultTag data={data} outputs={outputs} env={env} />
  );
}

const getTagStyle = (data): React.CSSProperties => {
  return {
    display: 'block',
    wordBreak: 'break-all',
    whiteSpace: data.isEllipsis ? 'nowrap' : 'pre-wrap',
    maxWidth: data.isEllipsis ? data?.ellipsis?.maxWidth + 'px' : undefined,
    overflow: 'hidden',
    textOverflow: data.isEllipsis ? 'ellipsis' : undefined
  };
};

const DefaultTag = ({
  data,
  outputs,
  env
}: Pick<RuntimeParams<Data>, 'data' | 'outputs' | 'env'>) => {
  const {
    direction,
    align,
    wrap,
    size,
    tags,
    tagSize,
    appendAble,
    closeAble,
    useAppendBtn,
    appendBtn = {
      text: '新增',
      icon: 'PlusOutlined'
    }
  } = data;
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const onTagClose = (index: number, tag: TagType) => {
    if (env.edit) return;
    data.tags.splice(index, 1);
    outputs['onChange']({ changed: { ...tag, index }, allTag: data.tags });
  };

  const onTagClick = (tag: TagType) => {
    if (env.edit) return;
    outputs['onClick'](tag);
  };

  const showInput = () => {
    if (env.edit) return;
    setInputVisible(true);
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputConfirm = (e) => {
    const inputValue = e.target.value;
    if (!!inputValue && inputVisible) {
      if (!!tags.find((tag) => tag.content === inputValue)) {
        message.warn('标签已存在');
        return;
      }
      const newTag = createTag(inputValue);
      data.tags.push(newTag);
      outputs['onChange']({ changed: { ...newTag, index: data.tags.length }, allTag: data.tags });
    }
    setInputVisible(false);
  };

  const appendJsx = useMemo(() => {
    if (!appendAble) return null;
    if (inputVisible) {
      return (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: 80 }}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      );
    }
    if (useAppendBtn) {
      return (
        <Tag
          data-item-tag="append"
          color="default"
          key={'tag-append'}
          icon={Icons && Icons[appendBtn.icon as string]?.render()}
          className={styles.appendBtn}
          onClick={showInput}
        >
          {appendBtn.text}
        </Tag>
      );
    }
    return null;
  }, [useAppendBtn, appendAble, inputVisible, JSON.stringify(appendBtn)]);

  return (
    <Space
      data-root="root"
      className={styles.wrap}
      direction={direction}
      align={align}
      wrap={wrap}
      size={size}
    >
      {tags.map((tag, index) => {
        let { key, content, color, icon, closable } = tag;
        closable = closable ?? closeAble;
        return (
          <Tag
            key={key}
            className={`${styles[tagSize]} ${styles.tag}`}
            data-index={index}
            data-item-tag="tag"
            color={color}
            closable={closable}
            onClose={() => onTagClose(index, tag)}
            icon={Icons && Icons[icon as string]?.render()}
            onClick={data.clickAble ? () => onTagClick(tag) : void 0}
            style={{
              cursor: data.clickAble ? 'pointer' : void 0
            }}
          >
            <span style={getTagStyle(data)}>{env.i18n(content)}</span>
          </Tag>
        );
      })}
      {appendJsx}
    </Space>
  );
};

const CheckTag = ({
  data,
  outputs,
  inputs,
  env
}: Pick<RuntimeParams<Data>, 'data' | 'outputs' | 'inputs' | 'env'>) => {
  const { direction, align, wrap, size, tags, tagSize } = data;
  const onTagChange = (index: number) => {
    const pre = data.tags[index];
    data.tags[index] = { ...pre, checked: !pre.checked };
    const checkedTags = data.tags.filter((tag) => tag.checked === true);
    outputs['onCheck']({
      changed: { ...data.tags[index], index },
      checked: checkedTags,
      allTag: data.tags
    });
  };

  useEffect(() => {
    if (env.runtime && inputs['getCheckedTags']) {
      inputs['getCheckedTags']((ds, relOutputs) => {
        const checkedTags = data.tags.filter((tag) => tag.checked === true);
        relOutputs['checkedTags'](checkedTags);
      });
    }
  }, []);

  return (
    <Space
      data-root="root"
      className={styles.wrap}
      direction={direction}
      align={align}
      wrap={wrap}
      size={size}
    >
      {tags.map((tag, index) => {
        const { key, checked, content } = tag;
        return (
          <Tag.CheckableTag
            key={key}
            className={`${styles[tagSize]} ${styles.tag}`}
            data-index={index}
            data-item-tag="tag"
            checked={checked as boolean}
            onChange={() => onTagChange(index)}
          >
            <span style={getTagStyle(data)}>{env.i18n(content)}</span>
          </Tag.CheckableTag>
        );
      })}
    </Space>
  );
};
