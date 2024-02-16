"use client";
import Drawer from "@/app/components/drawer/drawer";
import { ShareIcon, ShareIconProps } from "@/app/components/share/share-icon";
import { useShareDrawerState } from "@/app/components/share/state";
import { Link2Icon } from "lucide-react";
import Image from "next/image";

type ShareIcon = {
  icon: ShareIconProps["Icon"];
  name: string;
};

type ExternalShareIcon = ShareIcon & {
  createShareLink: (url: string, title: string) => string;
};

type InternalShareIcon = ShareIcon & {
  onClick: (url: string) => void;
};

type ShareProviders = (InternalShareIcon | ExternalShareIcon)[];

const shareProviders: ShareProviders = [
  {
    name: "Copy link",
    icon: Link2Icon,
    onClick: (url: string) => {
      navigator.clipboard.writeText(url);
    },
  },
  {
    name: "X",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M19.0443 13.5494L30.9571 -0.000442505H28.1341L17.7903 11.7647L9.52875 -0.000442505H0L12.4931 17.7905L0 31.9996H2.82309L13.7464 19.5752L22.4713 31.9996H32L19.0437 13.5494H19.0443ZM15.1777 17.9472L13.9119 16.1757L3.84029 2.07904H8.1764L16.3043 13.4555L17.5701 15.227L28.1355 30.0146H23.7994L15.1777 17.9479V17.9472Z"
          fill="black"
        />
      </svg>
    ),
    createShareLink: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${title}&url=${encodeURI(url)}`,
  },
  // TODO! Fix linkedin sharing.
  // {
  //   name: "LinkedIn",
  //   icon: () => (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="32"
  //       height="32"
  //       viewBox="0 0 32 32"
  //       fill="none"
  //     >
  //       <g clip-path="url(#clip0_544_1896)">
  //         <path
  //           d="M29.6313 -0.000442505H2.3625C1.05625 -0.000442505 0 1.03081 0 2.30581V29.6871C0 30.9621 1.05625 31.9996 2.3625 31.9996H29.6313C30.9375 31.9996 32 30.9621 32 29.6933V2.30581C32 1.03081 30.9375 -0.000442505 29.6313 -0.000442505ZM9.49375 27.2683H4.74375V11.9933H9.49375V27.2683ZM7.11875 9.91206C5.59375 9.91206 4.3625 8.68081 4.3625 7.16206C4.3625 5.64331 5.59375 4.41206 7.11875 4.41206C8.6375 4.41206 9.86875 5.64331 9.86875 7.16206C9.86875 8.67456 8.6375 9.91206 7.11875 9.91206ZM27.2687 27.2683H22.525V19.8433C22.525 18.0746 22.4937 15.7933 20.0562 15.7933C17.5875 15.7933 17.2125 17.7246 17.2125 19.7183V27.2683H12.475V11.9933H17.025V14.0808H17.0875C17.7188 12.8808 19.2688 11.6121 21.575 11.6121C26.3813 11.6121 27.2687 14.7746 27.2687 18.8871V27.2683Z"
  //           fill="black"
  //         />
  //       </g>
  //       <defs>
  //         <clipPath id="clip0_544_1896">
  //           <rect
  //             width="32"
  //             height="32"
  //             fill="white"
  //             transform="translate(0 -0.000442505)"
  //           />
  //         </clipPath>
  //       </defs>
  //     </svg>
  //   ),
  //   createShareLink: (url: string, title: string) =>
  //     `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(
  //       url
  //     )}&title=${title}`,
  // },
  {
    name: "Facebook",
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <g clip-path="url(#clip0_544_1900)">
          <path
            d="M16 -0.000442505C7.16352 -0.000442505 0 7.16308 0 15.9996C0 23.5029 5.16608 29.7992 12.135 31.5285V20.8892H8.83584V15.9996H12.135V13.8927C12.135 8.44692 14.5997 5.92276 19.9462 5.92276C20.96 5.92276 22.7091 6.1218 23.4246 6.3202V10.7522C23.047 10.7125 22.391 10.6927 21.5763 10.6927C18.953 10.6927 17.9392 11.6866 17.9392 14.2703V15.9996H23.1654L22.2675 20.8892H17.9392V31.8824C25.8618 30.9256 32.0006 24.18 32.0006 15.9996C32 7.16308 24.8365 -0.000442505 16 -0.000442505Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_544_1900">
            <rect
              width="32"
              height="32"
              fill="white"
              transform="translate(0 -0.000442505)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    createShareLink: (url: string, title: string) =>
      `http://www.facebook.com/sharer.php?u=${encodeURI(
        url
      )}&p[title]=${title}`,
  },
] as const;

export function ShareDrawer() {
  const { itemToBeShared, closeShareDrawer } = useShareDrawerState();
  const isOpen = Boolean(itemToBeShared);
  if (!isOpen) return;
  const fullUrl = `${globalThis?.location?.origin}${itemToBeShared?.link}`;

  return (
    <Drawer isOpen={isOpen} onClose={closeShareDrawer} removeWhenClosed={false}>
      {itemToBeShared && (
        <div className="w-full space-y-4">
          <Image
            width={600}
            height={315}
            src={`${itemToBeShared.link}/opengraph-image`}
            alt="Image"
          />

          <div className="flex gap-4">
            {shareProviders.map((provider) => (
              <div onClick={() => closeShareDrawer()}>
                {"onClick" in provider ? (
                  <div onClick={() => provider.onClick(fullUrl)}>
                    <ShareIcon Icon={provider.icon} text={provider.name} />
                  </div>
                ) : (
                  <a
                    key={provider.name}
                    href={provider.createShareLink(
                      fullUrl,
                      itemToBeShared.title
                    )}
                    target="_blank"
                  >
                    <ShareIcon Icon={provider.icon} text={provider.name} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Drawer>
  );
}
