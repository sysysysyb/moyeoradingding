import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100svh-18rem)] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-7xl font-bold tracking-tight text-fuchsia-400 md:text-8xl">
        404
      </p>
      <h1 className="mt-5 text-2xl font-bold text-gray-900 md:text-3xl">
        페이지를 찾을 수 없어요
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
        주소를 확인하거나 홈으로 돌아가 주세요.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-fuchsia-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-500"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
