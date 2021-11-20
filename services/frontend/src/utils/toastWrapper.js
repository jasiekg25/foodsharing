import { toast as reactToast } from "react-toastify";

export const toast = {
  success: (text) => {
    reactToast.dismiss()
    reactToast.success(text)
  },
  error: (text) => {
    reactToast.dismiss()
    reactToast.error(text)
  },
  info: (text) => {
    reactToast.dismiss()
    reactToast.info(text)
  }
}
