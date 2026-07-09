import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-default mb-4">
          404
        </h1>
        <p className="text-xl text-text-neutral mb-6">
          Page not found
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="py-2 px-4 text-sm font-semibold text-white bg-primary rounded-lg cursor-pointer transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
