import { useMedia } from "@/lib/hooks";
import { Nft, OwnedNft } from "alchemy-sdk";
import clsx from "clsx";
import { useState } from "react";
import CanvasDraw from "react-canvas-draw";

/* eslint-disable @next/next/no-img-element */
interface Props {
  token: Nft | OwnedNft;
}

export const MediaViewer = ({ token }: Props) => {
  const { mediaUrl, isVideo } = useMedia({ token });
  const borderRadius = "rounded-lg";

  if (isVideo) {
    return (
      <>
        {mediaUrl ? (
          <video
            className="aspect-square rounded-xl object-cover"
            muted
            autoPlay={true}
            loop={true}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <NoMedia className={borderRadius} />
        )}
      </>
    );
  }

  if (!mediaUrl) {
    return <NoMedia className={borderRadius} />;
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <img
          className="aspect-square rounded-lg object-cover"
          src={mediaUrl}
          alt="token image"
          width={"400px"}
          height={"400px"}
        />
      </div>
    </>
  );
};

export const SignatureCanvas = ({
  baseImage,
  canvasData,
}: {
  baseImage?: string;
  canvasData: any;
}) => {
  const style = {
    backgroundImage: `${
      baseImage
        ? `-webkit-linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${baseImage})`
        : `bg-black`
    }`,
    backgroundSize: `cover`,
    borderRadius: `8px`,
    width: `100%`,
    height: `100%`,
  };
  return (
    <CanvasDraw
      ref={(canvasDraw) => {
        if (canvasDraw && canvasData) {
          return canvasDraw.loadSaveData(canvasData);
        }
      }}
      brushColor={"white"}
      brushRadius={0}
      lazyRadius={0}
      disabled
      hideGrid
      style={style}
      hideInterface={true}
      loadTimeOffset={10}
    />
  );
};

function NoMedia({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative flex aspect-square items-center justify-center bg-gray-200",
        className
      )}
    >
      no media
    </div>
  );
}
