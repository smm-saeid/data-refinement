import {  useDrop } from "react-dnd";
import { seasonKeys } from "../../types";


type Props = {
    children?:React.ReactElement;
    month:number;
    handleMonth: (id: string, month: string) => void;

}
const DroppableCard : React.FC<Props> = ({children,month,handleMonth}) =>{

    const[{isOver}, drop]=useDrop(
    () =>({  
        accept: "unit", 
        drop: (item:any) =>  { handleMonth(item.unitId,seasonKeys[month]); }, 
        collect: (monitor) => ({ isOver: !!monitor.isOver()})
    })
    ) 

    return (<>
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} style={{opacity: isOver? 0.6:1 , width:'100%', flexGrow: 1, display:'flex' }}>{children}</div>
    </>);

}


export default DroppableCard
