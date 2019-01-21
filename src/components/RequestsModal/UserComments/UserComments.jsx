
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../../redux/actionCreator/commentsActions';
import CommentItem from './CommentItem';
import './UserComments.scss';
import generateDynamicTime from '../../../helper/generateDynamicTime';


export class UserComments extends Component {
  state = {
    commentToEdit: '',
    activeCommentId: '',
    editReady: false,
  };
  editComment = (comment) => {
    localStorage.setItem('comment', comment.comment);
    this.setState ({
      activeCommentId: comment.id,
      commentToEdit: comment.comment,
      editReady: true,
    });
  }

  resetEditing = () => {
    this.setState({
      commentToEdit: '',
      activeCommentId: '',
      editReady: false
    },
    localStorage.removeItem('comment'));
  }

  handleCancelClick = (event) => {
    event.preventDefault();
    this.resetEditing('');
  }

  handleNoEdit = () => {
    this.resetEditing('');
  }

  formatDate(date) {
    return generateDynamicTime(date);
  }

  renderCancelButton = () => {
    return (
      <button
        className="editor__post-btn editor__post-btn post-btn-text button-color" id="cancel-button"
        type="submit" onClick={this.handleCancelClick}>
          Cancel
      </button>
    );
  }

  render() {
    const { commentToEdit, activeCommentId, commentToDelete, editReady } = this.state;
    const { comments, email, deleteComment, currentUser } = this.props;
    return comments && comments.map((comment) => {
      const editedLabel = comment.isEdited  ? '<span>(edited)</span>' : '';
      return (
        <CommentItem
          key={comment.id}
          comment={comment}
          deleteComment={deleteComment}
          email={email}
          editReady={editReady}
          handleNoEdit={this.handleNoEdit}
          editedLabel={editedLabel}
          commentToEdit={commentToEdit}
          activeCommentId={activeCommentId}
          commentToDelete={commentToDelete}
          renderCancelButton={this.renderCancelButton}
          resetEditing={this.resetEditing}
          editComment={this.editComment}
          formatDate={this.formatDate}
          currentUser={currentUser}
        />
      );
    });
  }
}

UserComments.propTypes = {
  comments: PropTypes.array,
  email:PropTypes.string,
  deleteComment: PropTypes.func,
  currentUser: PropTypes.object,
};

UserComments.defaultProps = {
  deleteComment: () => {},
  comments: [],
  email: '',
  currentUser: {}
};


const actionCreators = {
  deleteComment,
};

export default connect(undefined, actionCreators)(UserComments);
