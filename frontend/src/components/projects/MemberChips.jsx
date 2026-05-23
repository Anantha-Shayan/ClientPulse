import Avatar from '../ui/Avatar';

export default function MemberChips({ members = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member) => (
        <span key={member.user?.id || member.id} className="inline-flex items-center gap-2 rounded-full bg-surface-container px-2 py-1 text-xs font-semibold text-on-surface-variant">
          <Avatar name={member.user?.name || member.name} />
          {member.user?.name || member.name}
        </span>
      ))}
    </div>
  );
}
