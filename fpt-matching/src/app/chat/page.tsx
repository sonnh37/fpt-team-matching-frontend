// import React, {useState} from 'react';
// import {Col, Container, Form, Row} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css'
// const WaitingRoom = ({joinChatRoom}) => {
//     const[username, setUsername] = useState();
//     const[chatroom, setChatroom] = useState();
//
//     return <Form onSubmit={ e => {
//         e.preventDefault();
//         joinChatRoom(username, chatroom);
//     }}>
//         <Row className="px-5 py-5">
//             <Col sm={12}>
//                 <Form.Group>
//                     <Form.Control placeholder={"Username"} onChange={e => setUsername(e.target.value)}/>
//                     <Form.Control placeholder={"Username"} onChange={e => setUsername(e.target.value)}/>
//                 </Form.Group>
//             </Col>
//         </Row>
//     </Form>
// }
// const Chat = () => (
//     <main>
//         <Container>
//             <Row className='px-5 my-5'>
//                 <Col sm="12">
//                     <h1 className='font-monospace'>
//                         Chat app
//                     </h1>
//                 </Col>
//             </Row>
//         </Container>
//     </main>
// );
//
// export default Chat;