import { useDrag } from "react-dnd";


type Props = {
    children?:React.ReactElement;
    unitId:string;
}
const DraggableCard : React.FC<Props> = ({children,unitId}) =>{

    const[{isDragging}, drag]=useDrag(
    () =>({  
        type: "unit", 
        item: { unitId: unitId}, 
        collect: (monitor)=> ({ item: monitor.getItem(), isDragging: !!monitor.isDragging()})
    })
    ) 

    return (<div ref={drag as unknown as React.Ref<HTMLDivElement>} style={{
        opacity: isDragging?0.5:1, 
        cursor:'move', 
        display:'inline-block',
        width:'100%',
        margin:'0px 0px 5px 5px',
        border:'1px dashed gray', 
        borderRadius:'5px',
        padding:'5px'
    }}>{children}</div>);

}


export default DraggableCard
