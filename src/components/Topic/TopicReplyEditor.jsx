import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styled/quill.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
};

// Этот костыль подчищает за ReactQuill, который оставляет
// после очистки формы мусорные символы
const handleOnChangeArgs = (...args) => {
  const [, delta, author, funcs] = args;
  return funcs.getText().length > 1 ? args : ['', delta, author, funcs];
};

const TopicReplyEditor = props => {
  const [clazz, setClazz] = useState('');
  const { value, onChange, replyRef, ...rest } = props;
  return (
    <ReactQuill
      className={clazz}
      ref={replyRef}
      value={value}
      onChange={(...args) => {
        onChange(...handleOnChangeArgs(...args));
      }}
      theme="snow"
      onFocus={() => {
        setClazz('my-quill');
      }}
      onBlur={() => {
        setClazz('');
      }}
      modules={modules}
      {...rest}
    />
  );
};

TopicReplyEditor.defaultProps = {
  value: '',
  replyRef: null,
};

TopicReplyEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  replyRef: PropTypes.func,
};

export default TopicReplyEditor;
