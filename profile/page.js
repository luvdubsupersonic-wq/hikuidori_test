import { getSession } from '@auth0/nextjs-auth0';

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return <div>ログインしてください。</div>;
  }

  return (
    <div>
      <h1>ようこそ、{user.name}さん</h1>
      <img src={user.picture} alt={user.name} />
    </div>
  );
}
