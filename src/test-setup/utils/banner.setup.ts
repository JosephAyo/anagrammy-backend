import { User } from "@database/entity/User";

export const global: { bannerId?: number; user?: User; [key: string]: any } = {};
