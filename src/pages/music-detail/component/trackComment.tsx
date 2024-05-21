import { useState } from "react";
import { Button } from "react-bootstrap";

interface Comment {
  id?: string;
  text: string;
  author: string;
  comments: Array<Comment>;
}
interface CommentInputProps {
  onSubmitComment: (newComment: Comment) => void;
}
interface CommentItemProps {
  comment: Comment;
}
const dummyComment: Comment[] = [
  {
    id: "1",
    text: "adfsadfs 1",
    author: "mrA",
    comments: [],
  },
  {
    id: "2",
    text: "adfsadfs 2",
    author: "mrA",
    comments: [
      {
        id: "4",
        text: "nestd 1st",
        author: "nested",
        comments: [],
      },
    ],
  },
  {
    id: "3",
    text: "adfsadfs 3",
    author: "mrA",
    comments: [],
  },
];
const CommentInput = ({ onSubmitComment }: CommentInputProps) => {
  const [inputText, setInputText] = useState("");
  return (
    <>
      <input
        placeholder="comments here"
        className="border border-secondary w-75 p-3 m-3  "
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
      ></input>
      <Button
        onClick={() => {
          onSubmitComment({ text: inputText, comments: [], id: "", author: "a" });
          setInputText("");
        }}
      >
        comment
      </Button>
      {/* onClick={(event) => onSubmitComment()} */}
    </>
  );
};

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState(dummyComment);
  const onSubmitComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };
  return (
    <>
      <div className="d-flex flex-column flex-wrap  gap-3 overflow-scroll ">
        <span>nested comment</span>
        <div className="">
          <CommentInput onSubmitComment={onSubmitComment} />
        </div>
        <div className="d-flex flex-column gap-3 ">
          {comments.map((comment, index) => {
            return (
              <>
                <CommentItem comment={comment}></CommentItem>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
export const TrackComments = CommentSection;

const CommentItem = ({ comment }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState(comment.comments);
  const onComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
    setIsReplying(false);
  };
  return (
    <>
      <div
        className="border border-secondary d-flex flex-column flex-wrap   p-3 "
        style={{ maxWidth: "1000px" }}
      >
        <p>{comment.author}</p>
        <div className="ms-2 me-2 text-break border border-primary ">{comment.text}</div>
        <Button
          className="ms-2 me-2 align-self-start m-1 "
          onClick={(event) => {
            setIsReplying(!isReplying);
          }}
        >
          reply
        </Button>
        {isReplying && (
          <>
            <CommentInput onSubmitComment={onComment} />
          </>
        )}
        {comments.map((comment) => (
          <CommentItem comment={comment} />
        ))}
      </div>
    </>
  );
};
