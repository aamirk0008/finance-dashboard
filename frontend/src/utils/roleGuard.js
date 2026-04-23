import { ROLES } from '../constants';

export const isAdmin = (role) => role === ROLES.ADMIN;
export const isAnalyst = (role) => role === ROLES.ANALYST;
export const isViewer = (role) => role === ROLES.VIEWER;
export const canWrite = (role) => role === ROLES.ADMIN;
export const canRead = (role) => role === ROLES.ADMIN || role === ROLES.ANALYST;