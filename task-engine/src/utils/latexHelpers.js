export function pthL(x){
    return x > 0 ? x : '('+x+')'
}

export function pmL(x){
    return x === 0 ? '' : x > 0 ? '+' + x : x
}

export function mltL(x){
    return x > 1 ? x : ''
}
