/**
 * Default preset — re-exports shadcn preset for backward compatibility
 * @module @comment-section/presets/default
 */

export {
    ShadcnCommentSection as CommentSection,
    ShadcnCommentItem as CommentItem,
    ShadcnActionBar as ActionBar,
    ShadcnReplyForm as ReplyForm,
    ShadcnReactionButton as ReactionButton,
    ShadcnAvatar as Avatar,
} from '../shadcn';

// Default export
export { ShadcnCommentSection as default } from '../shadcn';
