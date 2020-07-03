import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import './EditorField.css';
import { useField } from 'formik';

const wrapperHandler = (fn, value) => () => fn(value);

const EditorField = ({ name, replyRef, modules, className, children, ...rest }) => {
  const [{ onChange }, { value }] = useField(name);
  const [classFromState, setClassFromState] = useState('');

  return (
    <ReactQuill
      className={`${classFromState} ${className}`}
      ref={replyRef}
      value={value}
      onChange={onChange(name)}
      theme="snow"
      onFocus={wrapperHandler(setClassFromState, 'quill--focus')}
      onBlur={wrapperHandler(setClassFromState, '')}
      modules={modules}
      {...rest}
    >
      {/* {children} */}
    </ReactQuill>
  );
};

EditorField.defaultProps = {
  children: null,
  replyRef: null,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  },
  name: '',
  className: '',
};

EditorField.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  replyRef: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  modules: PropTypes.object,
  children: PropTypes.element,
};

export default EditorField;
