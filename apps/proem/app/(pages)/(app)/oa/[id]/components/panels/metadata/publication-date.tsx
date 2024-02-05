import dayjs from "dayjs";

export function PublicationDate({ children }: { children?: string }) {
  return (
    <>
      {children && (
        <div>
          <div>Publication date</div>
          <div className="text-white/50">
            {dayjs(children).format("D MMM YYYY")}
          </div>
        </div>
      )}
    </>
  );
}
