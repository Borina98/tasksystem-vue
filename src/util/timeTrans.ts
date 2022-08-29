export const timeTrans = (time:any, type:any) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000)
  let datestr = date.toJSON()
  if (type === 1) {
    datestr = datestr.substring(0, 10)
  } else {
    datestr = datestr.substring(0, 19).replace("T", " ")
  }
  return datestr
}