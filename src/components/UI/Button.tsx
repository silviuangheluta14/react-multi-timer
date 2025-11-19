import { type ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

function isAnchorProps(props: ButtonProps | AnchorProps): props is AnchorProps {
  return "href" in props;
}

export default function Button(props: ButtonProps | AnchorProps) {
  const { className = "", ...rest } = props as any;

  const isChip = className.includes("button--chip");
  const cls = [isChip ? null : "button", className].filter(Boolean).join(" ");

  if (isAnchorProps(props)) {
    return <a {...(rest as AnchorProps)} className={cls} />;
  }
  return <button {...(rest as ButtonProps)} className={cls} />;
}
