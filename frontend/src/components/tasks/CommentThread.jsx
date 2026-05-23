export default function CommentThread({ comments = [] }) {
  return (
    <div className="grid gap-2">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">{comment.content}</div>
      ))}
    </div>
  );
}
