import React from 'react';
import PropTypes from 'prop-types';
import { Button, Comment, Form, List, Input } from 'antd';
import queries from '../../../serverQueries';

class CommentToPhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      submitting: false,
      value: '',
    };
  }

  handleSubmit = async idPhoto => {
    const { value } = this.state;
    const data = { idPhoto, commentText: value };
    if (!value) {
      return;
    }
    await queries.addCommentToPhoto(data);
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState({
      value,
    });
  };

  render() {
    const { comments, submitting, value } = this.state;
    const { idPhoto } = this.props;
    const CommentList = () => <List comments={comments} />;
    const { TextArea } = Input;

    const Editor = ({ onSubmit }) => (
      <>
        <Form.Item>
          <TextArea
            rows={4}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            submitting={submitting}
            value={value}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            loading={submitting}
            onClick={() => onSubmit(idPhoto)}
            type="primary"
          >
            Добавить комментарий
          </Button>
        </Form.Item>
      </>
    );

    return (
      <>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment content={<Editor key="editor1" />} />
      </>
    );
  }
}

CommentToPhoto.propTypes = {
  idPhoto: PropTypes.number.isRequired,
};

export default CommentToPhoto;
