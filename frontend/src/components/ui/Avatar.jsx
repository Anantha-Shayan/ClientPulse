export default function Avatar({ name = 'User' }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-container text-xs font-bold text-white ring-1 ring-outline-variant">{initials}</span>;
}
