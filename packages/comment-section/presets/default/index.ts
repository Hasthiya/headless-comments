/**
 * Default preset — headless CommentSection with minimal unstyled UI.
 * Use renderReplyForm / renderComment for your own UI, or import ShadcnCommentSection for styled UI.
 * @module @comment-section/presets/default
 */

export { DefaultCommentSection as CommentSection, DefaultCommentSection } from './DefaultCommentSection';
export {
  ShadcnCommentSection,
  ShadcnCommentItem as CommentItem,
  ShadcnActionBar as ActionBar,
  ShadcnReplyForm as ReplyForm,
  ShadcnReactionButton as ReactionButton,
  ShadcnAvatar as Avatar,
  ShadcnCommentItem,
  ShadcnActionBar,
  ShadcnReplyForm,
  ShadcnReactionButton,
  ShadcnAvatar,
} from '../shadcn';

export { DefaultCommentSection as default } from './DefaultCommentSection';
