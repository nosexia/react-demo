import React, { FC } from 'react'
import { Button, Image } from 'antd'
import { useNavigate } from 'react-router-dom';
import './index.css'

type Props = {
    isEven: boolean,
    imgUrl: string,
    title: string,
    content: string,
}
const CardItem: FC<Props> = props => {
    let navigate = useNavigate();
    return (
        <div className="itemBox" style={{ flexDirection: props.isEven ? 'row' : 'row-reverse' }}>
            <Image
                preview={false}
                width={298}
                height={200}
                src={require('@/assets/images/' + props.imgUrl + '.png')}
            />
            <div className="contentDiv">
                <span className="itemTitle">{props.title}</span>
                <span className="itemScr">{props.content}</span>
                <span>
                    <Button type="primary" onClick={() => navigate("/model/model-scene")}>建模仿真</Button>
                </span>
            </div>
        </div>
    )
}
export default CardItem;
