import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill, { Quill } from 'react-quill';
import './EditorField.css';
import { useField } from 'formik';

const wrapperHandler = (fn, value) => () => fn(value);
const BlockEmbed = Quill.import('blots/block/embed'); // чтобы картинка оборачивалась в тег <p></p> при вставке указать  путь "blots/embed"
class ImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('alt', value.alt);
    node.setAttribute('src', value.src);
    node.setAttribute('class', value.class);
    node.setAttribute('class', 'img-fluid');
    return node;
  }

  static value(node) {
    return {
      alt: node.getAttribute('alt'),
      src: node.getAttribute('src'),
    };
  }
}
ImageBlot.blotName = 'img';
ImageBlot.tagName = 'img';

Quill.register(ImageBlot);

const EditorField = ({ name, setReplyRef, modules, className, children, ...rest }) => {
  const [{ onChange }, { value }] = useField(name);
  const [classFromState, setClassFromState] = useState('');

  return (
    <ReactQuill
      id="editor"
      className={`${classFromState} ${className}`}
      ref={setReplyRef && (evt => setReplyRef(evt))}
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
  setReplyRef: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  modules: PropTypes.object,
  children: PropTypes.element,
};

export default EditorField;
