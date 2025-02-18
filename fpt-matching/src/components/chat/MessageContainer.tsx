import {MessageModel} from "@/types/message-model";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {useEffect} from "react";




const MessageContainer = ({messages, refer, containerRef, lastHeight, scrollHandler} :
                          {messages: MessageModel[], refer: any, containerRef: any, lastHeight: number, scrollHandler: any}) => {

    const user = useSelector((state: RootState)=> state.user.user)
    if (!user) {
        throw new Error('No user found.');
    }
    useEffect(() => {
        if (containerRef.current){
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                containerRef.current.scrollTop = scrollHeight;
                return;
            }
            if (!lastHeight) {
                containerRef.current.scrollTop = scrollHeight;
            } else {
                if (scrollTop === 0) {
                    const diff = scrollHeight - lastHeight;
                    containerRef.current.scrollTop = diff;
                }
            }
        }
        // if (containerRef.current) {
        //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
        // }
    }, [messages, lastHeight]);

    return (
       <>
           <div ref={containerRef} onScroll={scrollHandler} className={`px-2 h-[83.9%] overflow-auto`}>
               {messages.map((message, index) => {
                   if (index == 0) {
                       return (
                           <table key={index} ref={refer} className={`m-2 flex ${message.sendById == user.id ? "flex-row-reverse": "flex-row"}`}>
                               <tbody key={index} className={"m-2"}>
                               <tr className={`text-white  ${message.sendById == user.id ? "bg-green-600": "bg-amber-600"} m-2`}>
                                   <td className={"px-4 py-2 rounded-3xl "}>{message.content}</td>
                               </tr>
                               </tbody>
                           </table>
                       )
                   } else {
                       return (
                           <table key={index} className={`m-2 flex ${message.sendById == user.id ? "flex-row-reverse": "flex-row"}`}>
                               <tbody key={index} className={"m-2"}>
                               <tr className={`text-white  ${message.sendById == user.id ? "bg-green-600": "bg-amber-600"} m-2`}>
                                   <td className={"px-4 py-2 rounded-3xl "}>{message.content}</td>
                               </tr>
                               </tbody>
                           </table>
                       )
                   }
               })}
           </div>
       </>
    )
}

export default MessageContainer;