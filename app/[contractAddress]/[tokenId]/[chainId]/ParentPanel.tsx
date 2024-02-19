import * as React from "react";
import { Nft } from "alchemy-sdk";
import { MediaViewer } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNft } from "@/lib/hooks";

const ParentPanelLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full overflow-scroll rounded-t-3xl bg-white p-6">{children}</div>;
};

const ParentPanel = ({
  tokenId,
  contractAddress,
  chainIdNumber,
}: {
  tokenId: string;
  contractAddress: string;
  chainIdNumber: number;
}) => {
  const { nftMetadata: parent, data: parentNftImages } = useNft({
    tokenId: parseInt(tokenId as string),
    contractAddress: contractAddress as `0x${string}`,
    chainId: chainIdNumber,
  });

  if (!parent) {
    return <ParentPanelLayout>No parent found</ParentPanelLayout>;
  }

  return (
    <ParentPanelLayout>
      <div className="py-6 text-2xl">
        Owner
        <hr />
      </div>
      <Alert className="mb-6">
        <AlertDescription>
          The above autograph is owned by and attached to the following collectible.
        </AlertDescription>
      </Alert>
      <div className="flex flex-row gap-6">
        <div className="w-[250px]">
          <MediaViewer token={parent as Nft} />
        </div>
        <div className="flex grow flex-col gap-3 p-6">
          <div className="flex flex-col">
            <div className="text-xs font-semibold uppercase">Collection</div>
            <div className="text-2xl font-bold">{parent.contract.name}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-semibold uppercase">token id</div>
            <div className="text-2xl font-bold">#{parent.tokenId}</div>
          </div>
        </div>
      </div>
    </ParentPanelLayout>
  );
};

export default ParentPanel;
