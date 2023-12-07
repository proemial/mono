type Props = {
  params: { id: string };
  searchParams: { text?: string };
};

export async function generateMetadata({ params, searchParams }: Props) {
  const title = `Proem - ${params.id}`;

  let description = searchParams.text;
  // if(!description) {
  //     const { text } = await PapersDao.getGptSummary(params.id, 'sm');
  //     const {sanitized} = sanitize(text);
  //     description = sanitized;
  // }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: `https://proem.ai/api/og/${params.id}?text=${description}`,
          width: 400,
          height: 200,
          alt: description,
        },
      ],
    },
  };
}

export default async function ReaderPage({ params, searchParams }: Props) {
  return (
    <div>
      <div>{params.id}</div>
      <div>{searchParams.text}</div>
    </div>
  );
}
