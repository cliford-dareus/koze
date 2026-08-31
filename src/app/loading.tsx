import Loader from "@/app/_components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center pb-nav pt-safe">
      <Loader />
    </div>
  );
}
