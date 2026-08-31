import Loader from "@/app/_components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center">
      <Loader />
    </div>
  );
}
