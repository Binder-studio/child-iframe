"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Variants, motion } from "framer-motion";
import ParentPanel from "./[contractAddress]/[tokenId]/[chainId]/ParentPanel";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { Nft } from "alchemy-sdk";
import { SignatureCanvas } from "@/components/ui";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import nameToNetwork from "@/lib/utils/nameToNetwork";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Token() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("for");
  const {
    data,
    error,
    isLoading: isLoadingOrder,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/api/campaigns/123/orders/${orderId}`,
    fetcher
  );

  const { data: backupData } = useSWR(
    `${process.env.NEXT_PUBLIC_SECONDARY_APP_URL}/api/campaigns/123/orders/${orderId}`,
    fetcher
  );
  const realData = data || backupData;

  const order = realData?.order;

  const collectionNetwork = order?.collectionNetwork;
  const contractAddress = order?.collectionAddress;
  const tokenId = order?.selectedTokenId;
  const canvasData = order?.autographData && JSON.parse(order?.autographData);
  const parentBaseImage = order?.nftImageURL;

  const showLoading = isLoadingOrder;

  const chainIdNumber = nameToNetwork(collectionNetwork) ?? 1;

  const [isShowing, toggleShow] = useState<boolean>(false);

  const variants = {
    closed: { y: "100%", transition: { duration: 0.75 }, height: "0%" },
    open: { y: "0", transition: { duration: 1.9, delay: 0.5 }, height: "85%" },
  } as Variants;

  if (showLoading) {
    return <Skeleton className="h-full w-full bg-slate-400" />;
  }

  return (
    <>
      <div className="max-w-[1080px]">
        <div
          className="absolute left-0 top-0 z-10 m-4 cursor-pointer rounded-full bg-zinc-300 text-zinc-900 opacity-50 transition-opacity duration-500 ease-in hover:opacity-100"
          onClick={() => toggleShow((t) => !t)}
        >
          {isShowing ? (
            <ChevronDownCircle className="h-8 w-8" />
          ) : (
            <ChevronUpCircle className="h-8 w-8" />
          )}
        </div>
        <motion.div
          className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
          animate={isShowing ? "open" : "closed"}
          variants={variants}
          initial="closed"
        >
          <ParentPanel
            tokenId={tokenId}
            contractAddress={contractAddress}
            chainIdNumber={chainIdNumber}
          />
        </motion.div>
      </div>

      {canvasData && (
        <div className="h-full w-full max-w-[1080px]">
          <SignatureCanvas baseImage={parentBaseImage} canvasData={JSON.stringify(canvasData)} />
        </div>
      )}
    </>
  );
}
