import { RenameModal } from "@/components/miro-components/modals/rename-modal";
import { Room } from "@/components/miro-components/room";
import { Canvas } from "./_components/canvas";
import { Loading } from "./_components/loading";

type BoardIdPageProps = {
  params: Promise<{ boardId: string }>; // Type params as a Promise
};

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params; // Await the params object

  return (
    <Room roomId={boardId} fallback={<Loading />}>
      <Canvas boardId={boardId} />
      <RenameModal />
    </Room>
  );
};

export default BoardIdPage;
