import { OpenAlexPaper } from "@proemial/models/open-alex";

type AuthorsProps = {
  authorships: OpenAlexPaper["data"]["authorships"];
};

export function Authors({ authorships }: AuthorsProps) {
  return (
    <>
      {authorships.length > 0 && (
        <div>
          <div>Authors</div>
          <div className="text-white/50 flex flex-wrap">
            {/* TODO: Show a max of 3 with expansion */}
            {authorships.map((authorship) => (
              <Author key={authorship.author.id} authorship={authorship} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

type AuthorProps = {
  authorship: OpenAlexPaper["data"]["authorships"][0];
};

function Author({ authorship }: AuthorProps) {
  const { display_name } = authorship.author;
  const name = `${display_name.charAt(0)}. ${display_name.split(" ").pop()}`;

  return (
    <div className="mr-1 border border-white/50 px-1 rounded-md text-nowrap">
      {name}
    </div>
  );
}
