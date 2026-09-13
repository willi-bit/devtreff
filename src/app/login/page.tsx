import { PasswordForm } from "@/components/password-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  // Only return to actual app pages; never redirect to a submitted external URL.
  const target =
    typeof next === "string" &&
    /^\/(?:demo|(?:room|host)\/[A-Z2-9]{6})?$/i.test(next)
      ? next
      : "/";
  return <PasswordForm next={target} />;
}
