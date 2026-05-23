import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist p-6 text-center">
      <div>
        <h1 className="text-3xl font-black">Access restricted</h1>
        <p className="mt-2 text-slate-600">Your role does not include this workspace.</p>
        <Link to="/login" className="mt-5 inline-block"><Button>Back to login</Button></Link>
      </div>
    </main>
  );
}
