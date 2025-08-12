const message = {
  error: (text: string) => console.error(text),
  info: (text: string) => console.info(text),
  success: (text: string) => console.log(text),
  warning: (text: string) => console.warn(text),
};

export default message
