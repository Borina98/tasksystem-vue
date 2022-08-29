
export const disposeTime=(oldtime:any)=>{
    const date1 = new Date(oldtime)
    // @ts-ignore
    const s2=Date.parse(new Date());

    const s1 = date1.getTime();
    const total = (s2 - s1) / 1000;
    // @ts-ignore
    const day = parseInt(total / (246060));
    const afterDay = total - day*24*60*60;//取得算出来天数后剩余的秒数
    // @ts-ignore
    const hour = parseInt(afterDay/(60*60));//计算整数小时百数
    let trueday ;
    if (hour>24){
        // @ts-ignore
        trueday = parseInt(hour/24)
    }
    let month;
    // @ts-ignore
    if (trueday>30)
        // @ts-ignore
        month = parseInt(trueday/30);

    var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
    // @ts-ignore
    var min = parseInt(afterHour/60);//计算整数分
    var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后度剩余的秒数
    if(trueday){
        return  trueday + "天前"
    }
    if(hour){
        return  hour + "小时前"
    }
    if(min){
        return  min + "分钟前"
    }
    if(afterMin){
        return  afterMin + "分钟前"
    }

}

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