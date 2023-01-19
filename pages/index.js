import dynamic from "next/dynamic";

const MeetingAppContainer = dynamic(
  () => import("../src/containers/CustomContainer"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <MeetingAppContainer />
  );
}
