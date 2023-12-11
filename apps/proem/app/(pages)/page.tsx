import logo from "@/app/images/logo.png";

export default function HomePage() {
  return (
    <main className={`min-h-[calc(100dvh-48px)] flex flex-col justify-begin`}>
      <div
        className={`h-[calc(100dvh-48px)] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
      >
        <div className="h-[30%]" />
        <div className="h-[50%] w-full flex flex-col justify-center items-center">
          <img src={logo.src} style={{ maxHeight: "40%" }} alt="" />
          <div className="text-3xl md:text-6xl">proem</div>
        </div>
        <div className="h-[40%] w-full flex justify-center items-center" />
      </div>
    </main>
  );
}
