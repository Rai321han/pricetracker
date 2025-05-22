type Props = {
  params: Promise<{ userId: string }>;
};

export default async function page({ params }: Props) {
  const { userId } = await params;
  return <div>User ID: {userId}</div>;
}
