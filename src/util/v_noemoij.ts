// @ts-ignore
let findEle = (parent:any, type:any) => {
    return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
}

// @ts-ignore
const trigger = (el:any, type:any) :void=> {
    const e = document.createEvent('HTMLEvents')
    e.initEvent(type, true, true)
    el.dispatchEvent(e)
}

// @ts-ignore
const emoji = {
    bind: function (el:any, binding:any, vnode:any) {
        // 正则规则可根据需求自定义
        var regRule = /[^u4E00-u9FA5|d|a-zA-Z|rns,.?!，。？！…—&$=()-+/*{}[]]|s/g
        let $inp = findEle(el, 'input')
        el.$inp = $inp
        $inp.handle = function () {
            let val = $inp.value
            $inp.value = val.replace(regRule, '')

            trigger($inp, 'input')
        }
        $inp.addEventListener('keyup', $inp.handle)
    },
    unbind: function (el:any) {
        el.$inp.removeEventListener('keyup', el.$inp.handle)
    },
}


// @ts-ignore
export default emoji;