const MessageContainer = ({messages}: {messages: string[]}) => {

    return (
        <div className={"px-2"}>
            {messages.map((message, index) => (
                <table key={index} className={"m-2"}>
                    <tr key={index} className={"m-2"}>
                        <td className="text-white bg-amber-600 rounded-3xl px-4 py-2 m-2">{message}</td>
                    </tr>
                </table>
            ))}
        </div>
    )
}

export default MessageContainer;