"use client";

import type { CSSProperties } from "react";
import Image, { type ImageProps } from "next/image";

function needsDirectLoad(src: string) {
  return (
    src.startsWith("/api/salam-photo") ||
    src.startsWith("https://api.salampakistan.gov.pk/")
  );
}

/**
 * next/image wrapper. Salam API photos go through /api/salam-photo?src=…
 * which Next 16 rejects via localPatterns when passed to next/image —
 * use a plain <img> for those to avoid runtime error remount loops.
 */
export default function SmartImage({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
  style,
  ...rest
}: Omit<ImageProps, "src"> & { src: string }) {
  if (needsDirectLoad(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...((style as CSSProperties) || {}),
          }}
        />
      );
    }

    const width = typeof rest.width === "number" ? rest.width : undefined;
    const height = typeof rest.height === "number" ? rest.height : undefined;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={style as CSSProperties | undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
      style={style}
      {...rest}
    />
  );
}
