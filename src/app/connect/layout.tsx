import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "New to C3? Fill out a connect card and let us know you're here. We'd love to say hello.",
};

export default function ConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
