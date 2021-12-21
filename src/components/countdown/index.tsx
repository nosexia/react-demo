import React, { FC, useEffect, useState } from 'react';
type ICountdown = {
    defalutCount?:number;
    callback: () => void;
    isStart:boolean;
}
const Countdown: FC<ICountdown> = ({ defalutCount = 10,callback,isStart=false }) => {
    const [count,setCount] = useState<number>(defalutCount)
   
    function startCountDown(){

    }

    useEffect(() => {
        if(count === 0){
            callback()
            return;
        }
       setTimeout(() => {
           setCount(count-1)
       }, 1000)
    }, [isStart])
    return <span>{count}   </span>
}

export default Countdown;