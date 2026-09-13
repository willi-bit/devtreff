import { ConvexError } from "convex/values";
import { verifyDemoAccess } from "../../shared/demo-access";

export async function requireDemoAccess(access: string) {
  if (!(await verifyDemoAccess(access)))
    throw new ConvexError(
      "Bitte öffne die Website und gib das Veranstaltungspasswort ein.",
    );
}
