// src/hooks/imageHooks.ts
import useCachedImage from "./useCachedImage";
import imagePaths from "../utils/imagePaths";

const imageHooks = {
  mainBg: () => useCachedImage(imagePaths.mainBg),
  signupBg: () => useCachedImage(imagePaths.signupBg),
  close: () => useCachedImage(imagePaths.close),
  closePreview: () => useCachedImage(imagePaths.closePreview),
  deleteRed: () => useCachedImage(imagePaths.deleteRed),
  delete: () => useCachedImage(imagePaths.delete),
  edit: () => useCachedImage(imagePaths.edit),
  view: () => useCachedImage(imagePaths.view),
  funds: () => useCachedImage(imagePaths.funds),
  home: () => useCachedImage(imagePaths.home),
  login: () => useCachedImage(imagePaths.login),
  connector: () => useCachedImage(imagePaths.connector),
  logout: () => useCachedImage(imagePaths.logout),
  return: () => useCachedImage(imagePaths.return),
  right: () => useCachedImage(imagePaths.right),
  settings: () => useCachedImage(imagePaths.settings),
  search: () => useCachedImage(imagePaths.search),
  sponsors: () => useCachedImage(imagePaths.sponsors),
  transactions: () => useCachedImage(imagePaths.transactions),
  users: () => useCachedImage(imagePaths.users),
  profile: () => useCachedImage(imagePaths.profile),
  sponsor: () => useCachedImage(imagePaths.sponsor),
  upload: () => useCachedImage(imagePaths.upload),
  show: () => useCachedImage(imagePaths.show),
  hide: () => useCachedImage(imagePaths.hide),
  succes: () => useCachedImage(imagePaths.succes),
  linkOwner: () => useCachedImage(imagePaths.linkOwner),
  inputPassword: () => useCachedImage(imagePaths.inputPassword),
  inputUsername: () => useCachedImage(imagePaths.inputUsername),
  changePassword: () => useCachedImage(imagePaths.changePassword),
  logoGradient: () => useCachedImage(imagePaths.logoGradient),
  logoLogin: () => useCachedImage(imagePaths.logoLogin),
  logoMain: () => useCachedImage(imagePaths.logoMain),
  logoMobile: () => useCachedImage(imagePaths.logoMobile),
  placeholderProfile: () => useCachedImage(imagePaths.placeholderProfile),
  sandboxLogo: () => useCachedImage(imagePaths.sandboxLogo),
};

export default imageHooks;
