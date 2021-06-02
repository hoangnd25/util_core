import { CurrentSessionType } from "@src/types/user";

export default function isAdminRole(currentSession: CurrentSessionType): boolean {
  return !!currentSession.account?.isAdministrator && !currentSession.account?.isContentAdministrator;
}