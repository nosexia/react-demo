export interface CardGroup {
    title: string;
    count:number;
    content: Card[]
}

export interface Card{
    imgUrl:string;
    title: string;
    id:string;
    model:string;
}