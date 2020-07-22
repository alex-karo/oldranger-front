import { TreeSelect } from 'antd';
import { useField, useFormikContext } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

const SelectField = ({ name, disabled, options, ...rest }) => {
  const [, { value }] = useField(name);
  const { setFieldValue } = useFormikContext();
  const normalizedTags = options.map(({ id, parentId, tag }) => ({
    id,
    pId: parentId,
    value: id,
    title: tag,
  }));
  return (
    <TreeSelect
      treeDataSimpleMode
      showSearch
      allowClear
      treeDefaultExpandAll
      name={name}
      disabled={disabled}
      optionFilterProp="title"
      value={value}
      multiple
      onChange={arr => setFieldValue(name, arr)}
      treeData={normalizedTags}
      {...rest}
    />
  );
};

SelectField.defaultProps = {
  disabled: false,
  name: '',
  options: [],
};

SelectField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
};

export default SelectField;
